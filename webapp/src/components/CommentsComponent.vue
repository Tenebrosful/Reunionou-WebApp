<template>
  <div v-if="error">
    <p></p>
  </div>
  <div v-else>
    <div v-if="loading"></div>
    <div v-else>
      <div
        class="col-sm-12 col-xs-12 chat"
        id="chat"
        style="overflow-x: hidden; outline: none; max-height: 300px"
        tabindex="5001"
      >
        <div class="col-inside-lg decor-default">
          <div class="chat-body" id="chatBody">
            <div v-for="(comment, index) in comments" :key="comment.id">
              <div
                v-if="
                  $store.state.user &&
                  $store.state.user.id === comment.author.id
                "
                class="answer right"
              >
                <div class="avatar">
                  <img
                    :src="comment.author.profile_image_url"
                    alt="User name"
                    style="width:100%"
                  />
                  <div class="status offline"></div>
                </div>
                <div class="name">Moi</div>
                <div></div>
                <div class="text">
                  <div class="relative inline-block mt-10">
                    <i
                      class="las la-ellipsis-h pointer"
                      @click="displaySettings(index)"
                    ></i>

                    <!-- Dropdown menu -->
                    <div
                      :id="'dropdownComment' + index"
                      class="bg-white"
                      style="
                        position: absolute;
                        right: 10px;
                        top: 35px;
                        display: none;
                      "
                    >
                      <a href="#" @click="deleteComment(comment.id)">
                        <span class="fs-6 mx-1"
                          ><i class="las la-trash-alt text-danger"></i>
                          supprimer
                        </span>
                      </a>
                    </div>
                  </div>
                  {{ comment.message }}
                  <div v-if="comment.media && video(comment.media)">
                    <video :src="comment.media"></video>
                  </div>
                  <div v-if="comment.media && image(comment.media)">
                    <a :href="comment.media" target="_bank"><img :src="comment.media" style="width:100%" /></a>
                  </div>
                </div>
                <div class="time">{{ dateFormat(comment.createdAt) }}</div>
              </div>

              <div v-else class="answer left">
                <div class="avatar">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt="User name"
                  />
                  <div class="status offline"></div>
                </div>
                <div class="name">{{ comment.author.username }}</div>
                <div class="text">
                  {{ comment.message }}
                  <div v-if="comment.media && video(comment.media)">
                    <video :src="comment.media"></video>
                  </div>
                  <div v-if="comment.media && image(comment.media)">
                    <a :href="comment.media" target="_bank"><img :src="comment.media" style="width:100%" /></a>
                  </div>
                </div>
                <div class="time">{{ dateFormat(comment.createdAt) }}</div>
              </div>
            </div>

            <div class="answer-add">
              <input
                type="text"
                class="form-control"
                placeholder="Write a message"
                v-model="message"
                @keyup.enter="sendComment()"
              />
              <span class="answer-btn answer-btn-1"></span>
              <span class="answer-btn answer-btn-2"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      loading: true,
      error: false,
      comments: [],
      message: "",
    };
  },

  mounted() {
    this.getCommentsEvent();
  },

  methods: {
    /**
     * Récupère les personnes associées à un évènement
     * @return none
     */
    getCommentsEvent() {
      axios
        .get(this.$apiUrl + "/event/" + this.id + "/comments?embedAuthor=true")
        .then((response) => {
          const comments = response.data.comments;
          this.comments = comments;
        })
        .catch((error) => {
          this.$toast.error(
            "Impossible de récupérer les commentaires liées à l'évènement. Erreur: " +
              error,
            {
              position: "bottom",
              timeout: 10000,
            }
          );
          console.log(error);
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * Enregistre un commentaire
     * @return none
     */
    sendComment() {
      if (this.message) {
        let urlImg
        if(this.detectURLs(this.message)){
          urlImg = (this.detectURLs(this.message))[0];
        } else urlImg = '';
  
        axios
          .post(
            this.$apiUrl + "/event/" + this.id + "/comments",
            { message: this.message, media: urlImg },
            { headers: { authorization: this.$store.state.user.token } }
          )
          .then((response) => {
            this.message = "";
            response.data.author = {
              username: this.$store.state.user.username,
              id: this.$store.state.user.id,
            };
            this.comments.push(response.data);
          })
          .catch((error) => {
            console.log(error);
            this.$toast.error(
              "Votre commentaire n'a pas été enregistré. Erreur: " + error,
              {
                position: "bottom",
              }
            );
          });
      }
    },

    displaySettings(index) {
      if (
        document.getElementById("dropdownComment" + index).style.display ===
        "none"
      )
        document.getElementById("dropdownComment" + index).style.display =
          "block";
      else
        document.getElementById("dropdownComment" + index).style.display =
          "none";
    },

    /**
     * Supprime le commentaire
     * @params id (id du commentaire)
     * @return none
     */
    deleteComment(id) {
      axios
        .delete(this.$apiUrl + "/comment/" + id, {
          headers: { authorization: this.$store.state.user.token },
        })
        .then((response) => {
          const index = this.comments.findIndex((comment) => comment.id === id);
          this.comments.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
          this.$toast.error(
            "Votre commentaire n'a pas été supprimé. Erreur: " + error,
            {
              position: "bottom",
            }
          );
        });
    },

    /**
     * Formate la date en format fr
     * @params date (date)
     * @return date formatée
     */
    dateFormat(date) {
      return new Date(date).toLocaleString();
    },

    /**
     * Cherche un media dans un string
     * @params text (string)
     * @return link
     */
    detectURLs(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex);
    },

    video(media){
      const video = ["mp4", "mkv", "avi"]
      const extension = media.split('.').pop();
      if(video.includes(extension)){
          return true
        } else return false
    },

    image(media){
      const image = ["jpg", "jpeg", "png", "gif"]
      const extension = media.split('.').pop();
      if(image.includes(extension)){
          return true
        } else return false
    },

    /**
     * Retourne une balise correspondant au média
     * @param media (string)
     * @return element html
     */
    addMedia(media){
      if(media){
        const image = ["jpg", "jpeg", "png", "gif"]
        const video = ["mp4", "mkv", "avi"]
        const extension = media.split('.').pop();
        if(image.includes(extension)){
          return `<img src=${media} alt=""/>`
        } else if (video.includes(extension)){
          return `<video src=${media}></video>`
        } else return
      } else return

    }
  },
};
</script>

<style scoped>
.form-control,
input:focus {
  border-color: greenyellow;
}
.row.row-broken {
  padding-bottom: 0;
}
.col-inside-lg {
  padding: 20px;
}
.chat {
  height: calc(100vh - 180px);
  overflow: scroll;
}
.chat-users h6 {
  font-size: 20px;
  margin: 0 0 20px;
}
.chat-users .user {
  position: relative;
  padding: 0 0 0 50px;
  display: block;
  cursor: pointer;
  margin: 0 0 20px;
}
.chat-users .user .avatar {
  top: 0;
  left: 0;
}
.chat .avatar {
  width: 40px;
  height: 40px;
  position: absolute;
}
.chat .avatar img {
  display: block;
  border-radius: 20px;
  height: 100%;
}
.chat .avatar .status.off {
  border: 1px solid #5a5a5a;
  background: #ffffff;
}
.chat .avatar .status.online {
  background: #4caf50;
}
.chat .avatar .status.busy {
  background: #ffc107;
}
.chat .avatar .status.offline {
  background: #ed4e6e;
}
.chat-users .user .status {
  bottom: 0;
  left: 28px;
}
.chat .avatar .status {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: absolute;
}
.chat-users .user .name {
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-users .user .mood {
  font: 200 14px/20px "Raleway", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/*****************CHAT BODY *******************/
.chat-body h6 {
  font-size: 20px;
  margin: 0 0 20px;
}
.chat-body .answer.left {
  padding: 0 0 0 58px;
  text-align: left;
  float: left;
}
.chat-body .answer {
  position: relative;
  max-width: 600px;
  overflow: hidden;
  clear: both;
}
.chat-body .answer.left .avatar {
  left: 0;
}
.chat-body .answer .avatar {
  bottom: 36px;
}
.chat .avatar {
  width: 40px;
  height: 40px;
  position: absolute;
}
.chat .avatar img {
  display: block;
  border-radius: 20px;
  height: 100%;
}
.chat-body .answer .name {
  font-size: 14px;
  line-height: 36px;
}
.chat-body .answer.left .avatar .status {
  right: 4px;
}
.chat-body .answer .avatar .status {
  bottom: 0;
}

.name {
  color: #ffffff;
}

.chat-body .answer.left .text {
  background: #ebebeb;
  color: #333333;
  border-radius: 8px 8px 8px 0;
}
.chat-body .answer .text {
  padding: 12px;
  font-size: 16px;
  line-height: 26px;
  position: relative;
}
.chat-body .answer.left .text:before {
  left: -30px;
  border-right-color: #ebebeb;
  border-right-width: 12px;
}
.chat-body .answer .text:before {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  border: 18px solid transparent;
  border-bottom-width: 0;
}
.chat-body .answer.left .time {
  padding-left: 12px;
  color: #b8b8b8;
}
.chat-body .answer .time {
  font-size: 16px;
  line-height: 36px;
  position: relative;
  padding-bottom: 1px;
}
/*RIGHT*/
.chat-body .answer.right {
  padding: 0 58px 0 0;
  text-align: right;
  float: right;
}

.chat-body .answer.right .avatar {
  right: 0;
}
.chat-body .answer.right .avatar .status {
  left: 4px;
}
.chat-body .answer.right .text {
  background: #7266ba;
  color: #ffffff;
  border-radius: 8px 8px 0 8px;
}
.chat-body .answer.right .text:before {
  right: -30px;
  border-left-color: #7266ba;
  border-left-width: 12px;
}
.chat-body .answer.right .time {
  padding-right: 12px;
  color: #b8b8b8;
}

/**************ADD FORM ***************/
.chat-body .answer-add {
  clear: both;
  position: relative;
  margin: 20px -20px -20px;
  padding: 20px;
  background: #46be8a;
}
.chat-body .answer-add input {
  border: none;
  background: none;
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 20px;
  padding: 0;
  color: #ffffff;
}
.chat input {
  -webkit-appearance: none;
  border-radius: 0;
}
.chat-body .answer-add .answer-btn-1 {
  background: url("http://91.234.35.26/iwiki-admin/v1.0.0/admin/img/icon-40.png")
    50% 50% no-repeat;
  right: 56px;
}
.chat-body .answer-add .answer-btn {
  display: block;
  cursor: pointer;
  width: 36px;
  height: 36px;
  position: absolute;
  top: 50%;
  margin-top: -18px;
}
.chat-body .answer-add .answer-btn-2 {
  background: url("http://91.234.35.26/iwiki-admin/v1.0.0/admin/img/icon-41.png")
    50% 50% no-repeat;
  right: 20px;
}
.chat input::-webkit-input-placeholder {
  color: #fff;
}

.chat input:-moz-placeholder {
  /* Firefox 18- */
  color: #fff;
}

.chat input::-moz-placeholder {
  /* Firefox 19+ */
  color: #fff;
}

.chat input:-ms-input-placeholder {
  color: #fff;
}
.chat input {
  -webkit-appearance: none;
  border-radius: 0;
}
</style>