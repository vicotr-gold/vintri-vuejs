<template>
  <section class="section-dashboard">
    <h2>Beers List</h2>
    <div class="search-bar">
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" @keyup="handleSearch()" single-line
        hide-details></v-text-field>
    </div>
    <div class="table-list">
      <div class="d-flex">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Name</th>
              <th class="text-left">First Brewed</th>
              <th class="text-left">Description</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>

            <tr v-for="item in beersList" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.first_brewed }}</td>
              <td>{{ item.description }}</td>
              <td>
                <v-btn icon="mdi-thumb-up" color="success" size="small" @click.stop="handleOpenModal(item)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="empty-list" v-if="beersList.length == 0">
          No Beers Data
        </div>
      </div>
    </div>
    <div class="pagination" v-if="search && beersList.length > 0">
      <v-btn variant="outlined" color="success" size="small" v-bind:disabled="currentPage == 1" @click="handlePrevPage">
        Prev</v-btn>
      {{ currentPage }}
      <v-btn variant="outlined" color="success" size="small"
        v-bind:disabled="beersList.length == 0 || beersList.length < 25" @click="handleNextPage">Next</v-btn>
    </div>
  </section>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h5">
        Add Rating
      </v-card-title>
      <v-card-text>
        <v-rating v-model="rating" hover active-color="orange lighten-3" color="orange"></v-rating>
        <v-textarea label="comments" rows="3" v-model="comments"></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="dialog = false" v-bind:disabled="loading">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" :loading="loading" v-bind:disabled="loading" text @click="handleAddComments">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "../api/axios";
import { useToast } from "vue-toastification";
import { useLoading } from 'vue3-loading-overlay';
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
export default {
  name: "DashboardPage",
  data() {
    return {
      dialog: false,
      rating: 0,
      selectedBeer: null,
      comments: '',
      loading: false,
      beersList: [],
      search: '',
      currentPage: 1,
      timer: null
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() { },
  methods: {
    handleOpenModal(item) {
      this.dialog = true
      this.selectedBeer = item.id
    },
    handleNextPage() {
      this.currentPage++
      this.getSearchResults(this.search, this.currentPage)
    },
    handlePrevPage() {
      this.currentPage--
      this.getSearchResults(this.search, this.currentPage)
    },
    getSearchResults(search, page) {
      const app = this
      if (search) {
        let loader = useLoading();
        loader.show({
          color: '#00ab00',
          loader: "bars"
        });
        axios
          .get("/beers", { params: { search: search, page: page } })
          .then((response) => {
            if (Array.isArray(response.data)) {
              app.beersList = response.data;
            }
            loader.hide()
          })
          .catch((error) => {
            loader.hide()
            app.toast.error(error?.response?.data?.message || "API Server Error", {
              timeout: 2000,
            });
          });
      } else {
        app.beersList.value = []
      }
    },
    handleSearch() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.currentPage = 1
        this.getSearchResults(this.search, this.currentPage)
      }, 300);
    },
    handleAddComments() {
      if (this.rating > 0 && this.selectedBeer) {
        this.loading = true
        axios.post("/beers/rating/" + this.selectedBeer, {
          rating: this.rating,
          comments: this.comments
        }).then(response => {
          this.dialog = false;
          this.rating = 0;
          this.selectedBeer = null;
          this.comments = '';
          console.log(response)
          this.loading = false
          this.toast("Thanks. Your rating added successfully.", {
            timeout: 2000,
          });
        }).catch(error => {
          this.loading = false
          this.toast.error(error?.response?.data?.message || "API Server Error", {
            timeout: 2000,
          });
        })
      } else {
        this.toast.error("Please select rating", {
          timeout: 2000,
        });
      }
    }
  },
};
</script>
