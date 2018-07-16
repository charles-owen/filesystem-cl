<?php
/**
 * @file
 *
 */

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\View;
use CL\Site\System\Server;
use CL\Site\Router\Router;


class FileSystemView extends View {
	public function __construct(Site $site, Server $server=null) 	{
		parent::__construct($site, [
			'at-least'=>['filesystem-view', \CL\Users\User::STAFF],
			'resource'=>'Files']);  // 'resource' is what will appear on the notauthorized page.

		if($server === null) {
			$server = new Server();
		}

		$router = new Router($site, $server);
		$router->add('view/:id', function($vars) use($site) {
			return new ErrorView($site, $vars);
		});

		$router->add('download/:id', function($vars) use($site, $server) {
			return new FileDownload($site, $server, $vars);
		});

		$this->setView($router->go());
	}
}