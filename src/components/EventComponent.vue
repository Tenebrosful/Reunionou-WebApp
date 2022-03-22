<template>
  <div class="modal-content" style="width:80vw; max-height:800px;overflow:hidden;">
    <div class="modal-header">
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <h4 class="modal-title text-danger mb-2" id="exampleModalLabel">
        {{ title }}
      </h4>
      <p class="fs-6">adresse: {{ address }}</p>
      <p>{{ descr }}</p>
      <div class="d-flex justify-content-center">
        <button type="button" class="btn btn-success me-5">Je viens</button>
        <button type="button" class="btn btn-danger">Je ne viens pas</button>
      </div>
      <ul class="nav nav-pills nav-justified mb-3 mt-5" id="pills-tab" role="tablist">
        <li class="nav-item" role="people">
          <button
            class="nav-link active"
            id="pills-people-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-people"
            type="button"
            role="tab"
            aria-controls="pills-people"
            aria-selected="true"
          >
            Personnes
          </button>
        </li>
        <li class="nav-item" role="comments">
          <button
            class="nav-link"
            id="pills-comments-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-comments"
            type="button"
            role="tab"
            aria-controls="pills-comments"
            aria-selected="false"
          >
            Commentaire
          </button>
        </li>
        <li class="nav-item" role="info">
          <button
            class="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-contact"
            type="button"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            info
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent" style="height:100%;">
        <div
          class="tab-pane fade show active"
          id="pills-people"
          role="tabpanel"
          aria-labelledby="pills-people-tab"
        >
          <PeopleComponent id='nimp'/>

        </div>
        <div
          class="tab-pane fade"
          id="pills-comments"
          role="tabpanel"
          aria-labelledby="pills-comments-tab"
          style="overflow-y:auto;"
        >
          <CommentsComponent id='nimp'/>
        </div>
        <div
          class="tab-pane fade"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          ...
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-warning" data-bs-dismiss="modal">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import PeopleComponent from './PeopleComponent.vue'
import CommentsComponent from './CommentsComponent.vue'
export default {
  props: ["id", "title", "descr", "address"],
  components: { PeopleComponent, CommentsComponent },
  data() {
    return {};
  },
};
</script>