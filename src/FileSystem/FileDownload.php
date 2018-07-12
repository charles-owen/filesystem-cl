<?php
/**
 * @file
 * View class for viewing the content of files.
 */

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\View;
use CL\Site\System\Server;

class FileDownload extends View {
	public function __construct(Site $site, Server $server, $vars) {
		parent::__construct($site);

		$this->server = $server;
		$this->id = $vars['id'];
	}

	public function whole() {
		$fs = new FileSystem($this->site->db);
		$file = $fs->readTextId($this->id);
		if($file === null) {
			return "No such file";
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