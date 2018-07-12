<template>
  <div class="content filesystem-editor-cl">
    <div class="full">
      <p><label><span>Application: </span><select v-model="selectedApp">
        <option>any</option>
        <option v-for="app in applications">{{app}}</option>
      </select></label></p>
      <p><label><span>User: </span><user-selector :selected="selected"></user-selector></label></p>
      <p class="center"><button :disabled="user === null" @click.prevent="query()">Query</button></p>
    </div>

    <table class="small" v-if="results.length > 0">
      <tr>
        <th>User</th>
        <th>Name</th>
        <th>File</th>
        <th>Created</th>
        <th>Modified</th>
      </tr>
      <tr v-for="result in results">
        <td>{{result.user}}</td>
        <td>{{result.username}}</td>
        <td><a :href="toView + '/' + result.id" target="_file">{{result.name}}</a>
        <a :href="toDownload + '/' + result.id"><img :src="toDownloadImg"></a></td>
        <td>{{result.createdStr}}</td>
        <td>{{result.modifiedStr}}</td>
      </tr>
    </table>

    <div class="full">
      <p class="centerbox primary">CourseLib includes a simple file system that is
        mainly provided to allow quizzes or other assignments to be persistent in the
        system and to provide a way for applications such as Cirsim to save and
        load files. It is not meant to be a way to turn in content, though this interface
        can be used to load content from the file system for any user.</p>
    </div>

  </div>
</template>

<script>
    import Dialog from 'dialog-cl';
    import {UserSelectorVue} from 'users-cl';

    export default {
        data: function() {
            return {
                selectedApp: 'any',
                user: null,
                applications: [],

                results: [],

                toView: Site.root + 'cl/filesystem/view',
                toDownload: Site.root + 'cl/filesystem/download',
                toDownloadImg: Site.root + 'vendor/cl/site/img/download.png'

            }
        },

        mounted() {
            this.$parent.setTitle(Console.title + ': File System');

            Site.api.get('/api/filesystem/applications', {})
                .then((response) => {
                    if(!response.hasError()) {
                        let data = response.getData('applications');
                        if(data !== null) {
                            this.applications = data.attributes;
                        }

                    } else {
                        Site.toast(this, response);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    Site.toast(this, error);
                });

        },
        components: {
            'user-selector': UserSelectorVue
        },
        methods: {
            selected(user) {
                this.user = user;
            },
            open(file) {
                console.log(file);
            },
            query() {
                if(this.user === null) {
                    return;
                }

                let params = {
                      'userId': this.user.id
                };

                if(this.application !== 'any') {
                    params.appTag = this.application;
                }

                Site.api.get('/api/filesystem', params)
                    .then((response) => {
                        if(!response.hasError()) {
                            console.log(response);
                            let data = response.getData('files');
                            if(data !== null) {
                                this.results = data.attributes;
                            }
                        } else {
                            Site.toast(this, response);
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        Site.toast(this, error);
                    });
    }
        }
    }
</script>

// Notice: Not scoped!
<style lang="scss">
div.filesystem-editor-cl {

  label span:first-child {
    display: inline-block;
    width: 10em;
    text-align: right;
    padding: 0 0.25em 0 0;
  }

  input[type=text], option {
    padding: 1px 0.25em;
  }

  select {
    min-width: 15em;
  }

  button:disabled {
    color: gray;
  }

}

</style>