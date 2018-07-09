<?php
/**
 * @file
 * Controller for AJAX POST page that manages the user filesystem
 */

namespace FileSystem;

/**
 * Controller for AJAX POST page that manages the user filesystem
 */
class FileSystemController extends \Controller {

	public function _construct(\Course $course, \User $user=null, $time=null) {
		parent::_construct($course, $user);

		if($time === null) {
			$time = time();
		}

		$this->time = $time;
	}

	public function post($post) {
		if($this->user === null) {
			return json_encode(array("ok"=>false, "msg"=>"not authorized"));
		}

		$assigntag = strip_tags($post['assignment']);
		$tag = strip_tags($post['tag']);

		// Allowed read-only options
		switch($post['cmd']) {
			case 'directory':
				return $this->directory($assigntag, $tag);

			case 'read':
				$filename = strip_tags($post['filename']);
				if(isset($post['userid'])) {
					if(!$this->user->at_least(\User::GRADER)) {
						return json_encode(array("ok"=>false, "msg"=>"not authorized!"));
					}

					$users = new \Users($this->course);
					$user = $users->get_user($post['userid']);
					if($user === null) {
						return json_encode(array("ok"=>false, "msg"=>"user does not exist"));
					}

					return $this->read($assigntag, $tag, $filename, $user);
				} else {
					return $this->read($assigntag, $tag, $filename, $this->user);
				}
		}

		if($assigntag !== '') {
			/*
			 * Determine the assignment
			 */
			$section = $this->user->get_section();
			$assignment = $section->get_assignment($assigntag);
			$assignment->load();
			if($assignment === null) {
				return json_encode(array("ok"=>false, "msg"=>"invalid assignment"));
			}

			// Has the assignment expired? (only students, not staff)
			if(!$this->user->is_staff() && !$assignment->is_open($this->user, $this->time)) {
				return json_encode(array("ok"=>false, "msg"=>"Assignment is not open for submission"));
			}
		}

		$filename = strip_tags($post['filename']);

		switch($post['cmd']) {
			case 'save':
				return $this->save($post, $assigntag, $tag, $filename);

			case 'write':
				return $this->write($post, $assigntag, $tag, $filename);

			case 'update':
				return $this->update($post, $assigntag, $tag, $filename);

			case 'exists':
				return $this->exists($assigntag, $tag, $filename);

			case 'delete':
				return $this->delete($assigntag, $tag, $filename);
		}

		return json_encode(array("ok"=>false, "msg"=>"not implemented"));
	}

	/**
	 * Save data as a file.
	 * save is unique from write in that write requires that the file not exist.
	 * For save, if the file does not exist, it is written, otherwise, it is updated.
	 * @param $post $_POST
	 * @param $assigntag Assignment tag
	 * @param $tag File tag (section or other name)
	 * @param $filename Name to save under
	 * @return string JSON result.
	 */
	private function save($post, $assigntag, $tag, $filename) {
		$fs = new FileSystem($this->course);
		$ret = $fs->save_text($this->user, $assigntag, $tag, $filename, $post['data'], $post['type']);

		if($ret !== false) {
			return json_encode(array("ok"=>true));
		} else {
			return json_encode(array("ok"=>false, "msg"=>"Unable to write file"));
		}
	}

	private function write($post, $assigntag, $tag, $filename) {
		$fs = new FileSystem($this->course);
		$ret = $fs->write_text($this->user, $assigntag, $tag, $filename, $post['data'], $post['type']);

		if($ret !== false) {
			return json_encode(array("ok"=>true));
		} else {
			return json_encode(array("ok"=>false, "msg"=>"Unable to write file"));
		}
	}

	private function update($post, $assigntag, $tag, $filename) {
		$fs = new FileSystem($this->course);
		$ret = $fs->update_text($this->user, $assigntag, $tag, $filename,
			$post['data'], $post['type']);

		if($ret !== false) {
			return json_encode(array("ok"=>true));
		} else {
			return json_encode(array("ok"=>false, "msg"=>"Unable to write file"));
		}
	}

	private function exists($assigntag, $tag, $filename) {
		$fs = new FileSystem($this->course);
		if($fs->exists($this->user, $assigntag, $tag, $filename)) {
			return json_encode(array("ok"=>false, "msg"=>"File does not exist"));
		} else {
			return json_encode(array("ok"=>true));
		}
	}

	private function directory($assigntag, $tag) {
		$fs = new FileSystem($this->course);
		$dir = $fs->directory($this->user, $assigntag, $tag);
		return json_encode(array("ok" => true, "dir" => $dir));
	}

	private function read($assigntag, $tag, $filename, \User $user) {
		$fs = new FileSystem($this->course);
		$data = $fs->read_text($user, $assigntag, $tag, $filename);
		if($data !== null) {
			$data['ok'] = true;
			return json_encode($data);
		} else {
			return json_encode(array("ok"=>false, "exists"=>false, "msg" => "Unable to read file"));
		}
	}

	private function delete($assigntag, $tag, $filename) {
		$fs = new FileSystem($this->course);
		$ret = $fs->delete($this->user, $assigntag, $tag, $filename);
		if($ret) {
			return json_encode(array("ok"=>true));
		} else {
			return json_encode(array("ok"=>false, "msg" => "Unable to delete file"));
		}
	}

	private $time;
}