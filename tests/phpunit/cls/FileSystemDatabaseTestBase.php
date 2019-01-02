<?php
/** @file
 * Base class for database tests.
 */

//require_once __DIR__ . '/../../cls/DatabaseTestBase.php';
use CL\Site\Test\DatabaseTestBase;


/**
 * Base class for database tests.
 *
 * Adds some assertions I find useful and a more useful way to add tables
 */
abstract class FileSystemDatabaseTestBase extends DatabaseTestBase {

	public function __construct() {
		parent::__construct(__DIR__ . '/..');
	}
}
