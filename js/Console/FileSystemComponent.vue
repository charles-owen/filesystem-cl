<template>
  <div class="content filesystem-editor-cl">
    <div class="full">
      <p><label><span>Application: </span><select v-model="selectedApp">
        <option>any</option>
        <option v-for="app in applications">{{app}}</option>
      </select></label></p>
      <p><label><span>User: </span><user-selector :selected="selected"></user-selector></label></p>
      <p class="center"><button :disabled="user === null" @click.prevent="query()">Query</button></p>

      <div v-if="fetched">
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
            <td><a :href="root + '/cl/filesystem/view/' + result.id" target="_file">{{result.name}}</a>
            <a :href="root + '/cl/filesystem/download/' + result.id"><img :src="root + '/vendor/cl/site/img/download.png'"></a></td>
            <td>{{result.createdStr}}</td>
            <td>{{result.modifiedStr}}</td>
          </tr>
        </table>
        <p v-if="results.length === 0" class="centerbox secondb center">No files...</p>
      </div>

      <p class="centerbox primary">CourseLib includes a simple file system that is
        mainly provided to allow quizzes or other assignments to be persistent in the
        system and to provide a way for applications such as Cirsim to save and
        load files. It is not meant to be a way to turn in content, though this interface
        can be used to load content from the file system for any user.</p>
    </div>

  </div>
</template>

<script>
	const UserSelectorVue = Site.UserSelectorVue;
	const ConsoleComponentBase = Site.ConsoleComponentBase;

  /**
   * Console component used to view the contents of the file system by user.
   * @constructor FileSystemComponentVue
   */
	export default {
		extends: ConsoleComponentBase,
		data: function () {
			return {
				selectedApp: 'any',
				fileUser: null,
				applications: [],

				fetched: false,
				results: [],
			}
		},

		mounted() {
			this.$root.setTitle(': File System');

			this.$site.api.get('/api/filesystem/applications', {})
				.then((response) => {
					if (!response.hasError()) {
						let data = response.getData('applications');
						if (data !== null) {
							this.applications = data.attributes;
						}

					} else {
						this.$site.toast(this, response);
					}

				})
				.catch((error) => {
					console.log(error);
					this.$site.toast(this, error);
				});

		},
		components: {
			'user-selector': UserSelectorVue
		},
		methods: {
			selected(user) {
				this.fileUser = user;
			},
			query() {
				if (this.fileUser === null) {
					return;
				}

				this.fetched = false;

				let params = {
					  'userId': this.fileUser.id
				};

				if (this.selectedApp !== 'any') {
					params.appTag = this.selectedApp;
				}

				this.$site.api.get('/api/filesystem', params)
					.then((response) => {
						if (!response.hasError()) {
							this.fetched = true;
							let data = response.getData('files');
							if (data !== null) {
								this.results = data.attributes;
							}
						} else {
							this.$site.toast(this, response);
						}

					})
					.catch((error) => {
						console.log(error);
						this.$site.toast(this, error);
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