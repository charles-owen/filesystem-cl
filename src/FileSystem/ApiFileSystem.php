<?php
/**
 * @file
 * API Resource for /api/filesystem
 */
namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Site\Api\JsonAPI;
use CL\Site\Api\APIException;
use CL\Users\Api\Resource;
use CL\Users\User;
use CL\Users\Users;

/**
 * API Resource for /api/filesystem
 */
class ApiFileSystem extends Resource {
	/// Default query limit for file queries
	const QUERY_LIMIT = 500;

	/**
	 * ApiFileSystem constructor.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Dispatch to this component from the router.
	 * @param Site $site The Site configuration object
	 * @param Server $server The Server object
	 * @param array $params Parameters after the path
	 * @param array $properties Properties from the path, should be empty
	 * @param int $time Time stamp
	 * @return JsonAPI Result
	 * @throws APIException On error
	 */
	public function dispatch(Site $site, Server $server, array $params, array $properties, $time) {
		$user = $this->isUser($site);

		if(count($params) === 0) {
			return $this->query($site, $user, $server);
		}

		switch($params[0]) {
			case 'save':
				return $this->save($site, $user, $server, $params, $time);

			case 'load':
				return $this->load($site, $user, $server, $params, $time);

			case 'upload':
				return $this->upload($site, $user, $server, $params, $time);

			case 'applications':
				return $this->applications($site, $user, $server);

			case 'tables':
				return $this->tables($site, $server, new FileSystemTables($site->db));
		}

		throw new APIException("Invalid API Path", APIException::INVALID_API_PATH);
	}

	/**
	 * Basic query of the file system
	 * /cl/api/filesystem
	 *
	 * Only available to staff!
	 * @param Site $site Site object
	 * @param User $user User object
	 * @param Server $server Server object
	 * @return JsonAPI
	 * @throws APIException
	 */
	private function query(Site $site, User $user, Server $server) {
		$this->atLeast($user, User::STAFF);

		if($server->requestMethod !== 'GET') {
			throw new APIException('Invalid API usage', APIException::INVALID_API_USAGE);
		}

		$params = [];
		$get = $server->get;

		if(!empty($get['userId'])) {
			$params['userId'] = $get['userId'];
		}

		if(!empty($get['memberId'])) {
			$params['memberId'] = $get['memberId'];
		}

		if(!empty($get['limit'])) {
			$limit = $get['limit'];
		} else {
			$limit = ApiFileSystem::QUERY_LIMIT;
		}

		$params['limit'] = $limit + 1;

		if(!empty($get['appTag'])) {
			$params['appTag'] = $get['appTag'];
		}

		if(!empty($get['name'])) {
			$params['name'] = $get['name'];
		}

		$fs = new FileSystem($site->db);
		$result = $fs->query($params);

		$json = new JsonAPI();
		$json->addData('files',  0, $result);
		return $json;
	}

	/**
	 * Save a file. Creates file is does not exist, or replaces any existing file.
	 *
	 * /cl/api/filesystem/save
	 *
	 * _POST['appTag']
	 * _POST['name']
	 * _POST['userId'] - Admin users only!
	 * _POST['data']
	 * _POST['type']
	 * _POST['permission'] (optional)
	 *
	 * @param Site $site
	 * @param User $user
	 * @param Server $server
	 * @param array $params
	 * @param $time
	 * @return JsonAPI
	 * @throws APIException If unable to write file
	 */
	private function save(Site $site, User $user, Server $server, array $params, $time) {
		if($server->requestMethod !== 'POST') {
			throw new APIException('Invalid API usage', APIException::INVALID_API_USAGE);
		}

		$post = $server->post;
		$fileUser = $this->getFileUser($site, $user, $post);

		$this->ensure($post, ['appTag', 'name', 'data']);
		$appTag = Resource::sanitize($post['appTag']);
		$name = Resource::sanitize($post['name']);
		$type = Resource::sanitize($post['type']);
		if(isset($post['permission'])) {
			$permission = Resource::sanitize($post['permission']);
		} else {
			$permission = FileSystem::PERMISSION_PRIVATE;
		}

		if(!$user->staff && $site->installed('course')) {
			// When the course system is installed, we check to see if
			// the $appTag is an application tag. If so, we ensure we
			// do not write that tag if the assignment is not open
			$course = $site->course;
			$section = $course->get_section_for($user);
			if($section !== null) {
				$assignment = $section->get_assignment($appTag);
				if($assignment !== null && !$assignment->is_open($user, $time)) {
					throw new APIException('Assignment is not open for submission');
				}
			}
		}

		// Notice: data is not sanitized and may include tags...
		$data = $post['data'];

		$memberId = $fileUser->member !== null ? $fileUser->member->id : 0;

		$fs = new FileSystem($site->db);
		if(!$fs->fileExists($user->id, $memberId, $appTag, $name)) {
			$ret = $fs->writeText($fileUser->id, $memberId, $appTag, $name, $data, $type, $permission, $time);
			if($ret === false) {
				$site->filesystem->logger->error("FileSystem save failed");
			}

		} else {
			$ret = $fs->updateText($fileUser->id, $memberId, $appTag, $name, $data, $type, $permission, $time);
			if($ret === false) {
				$site->filesystem->logger->error("FileSystem update failed");
			}
		}

		if($ret === false) {
			throw new APIException("Unable to write to file system");
		}

		return new JsonAPI();
	}

	/**
	 * Get the user for the file request.
	 *
	 * This can be altered using the post options memberId or userId to get
	 * files for any user. Those are admin capabilities.
	 *
	 * @param Site $site The site object
	 * @param User $user The requesting user
	 * @param array $post $_POST
	 * @return User
	 * @throws APIException
	 */
	private function getFileUser(Site $site, User $user, array $post) {

		if(isset($post['memberId'])) {
			$this->atLeast($user, User::ADMIN);

			$members = new \CL\Course\Members($site->db);
			$fileUser = $members->getAsUser($post['memberId']);
			if($fileUser === null) {
				throw new APIException('Member does not exist');
			}
		}
		else if(isset($post['userId'])) {
			$this->atLeast($user, User::ADMIN);

			$users = new Users($site->db);
			$fileUser = $users->get($post['userId']);
			if($fileUser === null) {
				throw new APIException('User does not exist');
			}
		} else {
			$this->atLeast($user, User::USER);
			$fileUser = $user;
		}

		return $fileUser;
	}


	/**
	 * Load a file. Loads a file if it exists.
	 *
	 * _POST['appTag']
	 * _POST['name']
	 * _POST['userId'] - Admin users only!
	 *
	 * @param Site $site
	 * @param User $user
	 * @param Server $server
	 * @param array $params
	 * @param $time
	 * @return JsonAPI
	 * @throws APIException If unable to write file
	 */
	private function load(Site $site, User $user, Server $server, array $params, $time) {
		if($server->requestMethod !== 'GET') {
			throw new APIException('Invalid API usage', APIException::INVALID_API_USAGE);
		}

		$get = $server->get;

		$fileUser = $this->getFileUser($site, $user, $get);
		$memberId = $fileUser->member !== null ? $fileUser->member->id : 0;

		$this->ensure($get, ['appTag', 'name']);
		$appTag = Resource::sanitize($get['appTag']);
		$name = Resource::sanitize($get['name']);

		$fs = new FileSystem($site->db);
		$ret = $fs->readText($fileUser->id, $memberId, $appTag, $name);
		if($ret === null) {
			throw new APIException("Unable to read file from the file system");
		}

		$json = new JsonAPI();
		$json->addData('file-data',  $ret['id'], $ret);
		return $json;
	}

	/**
	 * Query the available applications (appTag values)
	 *
	 * @param Site $site
	 * @param User $user
	 * @param Server $server
	 * @return JsonAPI
	 * @throws APIException If unable to write file
	 */
	private function applications(Site $site, User $user, Server $server) {
		$this->atLeast($user, User::STAFF);

		$fs = new FileSystem($site->db);
		$appTags = $fs->queryAppTags();

		$json = new JsonAPI();
		$json->addData('applications',  0, $appTags);
		return $json;
	}

	private function upload(Site $site, User $user, Server $server, array $params, $time) {
		$file = $server->files["upload"];
		$type = $file['type'];

		if ($file["error"] > 0 || $file["tmp_name"] == "") {
			// Error return
			$json = new JsonAPI();
			$json->addError('No supplied file');
			return $json;
		}

		if(!isset($server->post['appTag'])) {
			$json = new JsonAPI();
			$json->addError('No supplied application tag (appTag)');
			return $json;
		}

		$name = $file["name"];
		$sepext = explode('.', strtolower($name));
		$ext = end($sepext);       // gets extension
		$appTag = trim(strip_tags($server->post['appTag']));
		$path = $file["tmp_name"];

		if(!$user->staff && $site->installed('course')) {
			// When the course system is installed, we check to see if
			// the $appTag is an application tag. If so, we ensure we
			// do not write that tag if the assignment is not open
			$course = $site->course;
			$section = $course->get_section_for($user);
			if($section !== null) {
				$assignment = $section->get_assignment($appTag);
				if($assignment !== null && !$assignment->is_open($user, $time)) {
					throw new APIException('Assignment is not open for submission');
				}
			}
		}

		$memberId = $user->member !== null ? $user->member->id : 0;

		$fs = new FileSystem($site->db);
		$fs->writeFile($user->id, $memberId, $appTag, $name, $path,
			$type, FileSystem::PERMISSION_PRIVATE, $time);

		$json = new JsonAPI();
		return $json;
	}
}