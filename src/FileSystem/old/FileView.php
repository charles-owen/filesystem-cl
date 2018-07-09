<?php
/**
 * @file
 * View class for viewing files in the File System.
 */

namespace FileSystem;

use \Course;
use \User;
use \View;
use \FileSystem\FileSystem;

/**
 * View class for viewing files in the File System.
 */
class FileView extends \View {
    /**
     * @param Course $course The Course object
     * @param User $user The viewing user
     */
    public function __construct(Course $course, User $user, &$get) {
        parent::__construct($course, $user, $get);

        $this->get = $get;
        $id = $get['id'];

        $fs = new FileSystem($course);
        $files = $fs->query(['id'=>$id]);
        if(count($files) > 0) {
            $this->file = $files[0];
            $assigntag = $this->file['assign'];
            $tag = $this->file['tag'];
            $name = $this->file['name'];
            $this->set_title("File: $assigntag/$tag/$name");
        } else {
            $this->set_title("File: File does not exist");
        }
    }

    public function present() {
        $assigntag = $this->file['assign'];
        $tag = $this->file['tag'];
        $name = $this->file['name'];
        $type = $this->file['type'];

        $html = <<<HTML
<div>
<p></p>
<table class="small">
<tr><th>Category</th><th>Name</th></tr>
<tr><td>Assignment</td><td>$assigntag</td></tr>
<tr><td>Tag</td><td>$tag</td></tr>
<tr><td>Name</td><td>$name</td></tr>
<tr><td>Type</td><td>$type</td></tr>
</table>
HTML;


        switch($type) {
            case 'text/plain':
                $html .= $this->textPlain();
                break;

            default:
                $html .= '<p class="center">Unable to preview this file type</p>';
                break;
        }

        $html .= '</div>';
        return $html;
    }

    private function textPlain() {
        $html = '';

        $fs = new FileSystem($this->course);
        $content = $fs->read_text_id($this->file['id']);

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

    private $get;
    private $file = null;
}