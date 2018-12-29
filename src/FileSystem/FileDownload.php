<?php
/**
 * @file
 * View class for downloading the content of files.
 */

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\View;
use CL\Site\System\Server;

/**
 * View class for downloading the content of files.
 */
class FileDownload extends View {
	/**
	 * FileDownload constructor.
	 * @param Site $site The Site object
	 * @param Server $server The Server object
	 * @param array $params Parameters passed to route ('id')
	 */
	public function __construct(Site $site, Server $server, $params) {
		parent::__construct($site);

		$this->server = $server;
		$this->id = $params['id'];
	}

	/**
	 * Present the whole file including header configuration.
	 * @return string Downloaded file
	 */
	public function whole() {
		$fs = new FileSystem($this->site->db);
		$file = $fs->readTextId($this->id);
		if($file === null) {
			return "No such file";
		}

		// Verify permissions
		$user = $this->site->users->user;
		if(!$user->staff) {
			if($user->id !== $file['userId']) {
				return 'Not authorized';
			}

			if($file['memberId'] !== 0) {
				if($user->member === null || $user->member->id !== $file['memberId']) {
					return 'Not authorized';
				}
			}
		}

		$server = $this->server;
		$server->header('Content-Type: ' . $file['type']);
		$server->header("Content-Transfer-Encoding: Binary");
		$server->header("Content-disposition: attachment; filename=\"" . $file['name'] . "\"");
		return $file['data'];
	}

	private $server;
	private $id;
}