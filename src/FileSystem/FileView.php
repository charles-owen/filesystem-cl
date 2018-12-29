<?php
/**
 * @file
 * View class for viewing the content of files.
 */

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\View;
use CL\Site\System\Server;

/**
 * View class for viewing the content of files.
 */
class FileView extends View {
	/**
	 * FileView constructor.
	 * @param Site $site The Site configuration
	 * @param array $properties Properties passed from the router.
	 */
	public function __construct(Site $site, Server $server, $properties) {
		parent::__construct($site);

		// Paths to the view are of the form:
		// cl/filesystem/view/22
		// where 22 is an id for a file to view.
		$id = $properties['id'];

		$fs = new FileSystem($site->db);
		$files = $fs->query(['id'=>$id]);
		if(count($files) > 0) {
			$this->file = $files[0];
			$name = $this->file['name'];
			$this->title = "File: $name";
		} else {
			$this->title = "File: File does not exist";
			return;
		}

		// Verify permissions
		$user = $this->site->users->user;
		if(!$user->staff) {
			if($user->id !== $this->file['userId']) {
				$this->title = "File: Not authorized";
				$this->file = null;

				$server->redirect($site->root . '/cl/notauthorized');
				return;
			}

			if($this->file['memberId'] !== 0) {
				if($user->member === null || $user->member->id !== $this->file['memberId']) {
					$this->title = "File: Not authorized";
					$this->file = null;

					$server->redirect($site->root . '/cl/notauthorized');
					return;
				}
			}
		}
	}

	/**
	 * Present the page content
	 * @return string HTML
	 */
	public function present() {
		if($this->file === null) {
			return '<p>File does not exist.</p>';
		}

		$user = $this->file['user'];
		$userName = $this->file['username'];
		$appTag = $this->file['appTag'];
		$name = $this->file['name'];
		$type = $this->file['type'];
		$created = $this->file['createdStr'];
		$modified = $this->file['modifiedStr'];

		$html = <<<HTML
<div>
<p></p>
<table class="small">
<tr><th class="center">Category</th><th>Name</th></tr>
<tr><th>User</th><td>$user</td></tr>
<tr><th>User Name</th><td>$userName</td></tr>
<tr><th>Application</th><td>$appTag</td></tr>
<tr><th>File Name</th><td>$name</td></tr>
<tr><th>Type</th><td>$type</td></tr>
<tr><th>Created</th><td>$created</td></tr>
<tr><th>Modified</th><td>$modified</td></tr>

</table>
HTML;

		if(substr($type, 0, 6) === 'image/') {
			$html .= $this->image();
		} else {
			switch($type) {
				case 'text/plain':
					$html .= $this->textPlain();
					break;

				default:
					$html .= '<p class="center">Unable to preview this file type</p>';
					break;
			}
		}



		$html .= '</div>';
		return $html;
	}

	private function textPlain() {
		$html = '';

		$fs = new FileSystem($this->site->db);
		$content = $fs->readTextId($this->file['id']);

		// Try to decode
		$json = json_decode($content['data'], true);
		if($json !== null) {
			//
			// Quizzes are indicated by an array of arrays and
			// the low level array having a key 'name'
			//
			if(isset($json[0]['name'])) {
				$html .= $this->textJson($json);
			}
		} else {
			$x = htmlentities($content['data']);
			$html .= <<<HTML
<pre class="code">$x</pre>
HTML;
		}

		return $html;
	}

	private function image() {
		$url = $this->site->root . '/cl/filesystem/download/' . $this->file['id'];
		return <<<HTML
<figure class="center"><img src="$url"></figure>
HTML;
	}

	private function textJson($json) {
		$html = '';

		foreach($json as $file) {
			$name = $file['name'];
			$value = htmlentities($file['value']);
			$html .= <<<HTML
<h2>$name</h2>
<pre class="code">$value</pre>
HTML;

		}

		return $html;
	}

	private $file = null;
}