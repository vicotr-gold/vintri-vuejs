<template>
  <section class="section-dashboard">
    <h2>Beers List</h2>
    <div class="search-bar">
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
    </div>
    <div class="table-list">
      <div>
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

    <div class="pagination">
      <v-btn variant="outlined" color="success" size="small" v-bind:disabled="currentPage == 1" @click="handlePrevPage">
        Prev</v-btn>
      {{ currentPage }}
      <v-btn variant="outlined" color="success" size="small"
        v-bind:disabled="beersList.length == 0 || beersList.length < 25" @click="handleNextPage">Next</v-btn>
    </div>
  </section>
  <v-dialog v-model="dialog" max-width="500">
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

        <v-btn color="green darken-1" text @click="dialog = false">
          Cancel
        </v-btn>

        <v-btn color="green darken-1" text @click="handleAddComments">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { watch, ref } from "vue";
import axios from "../api/axios";
import { useToast } from "vue-toastification";
import useDebouncedRef from "../utils/useDebouncedRef";
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
      comments: ''
    };
  },
  setup() {
    const beersList = ref([]);
    const search = useDebouncedRef("", 400);
    const currentPage = ref(1);
    watch(search, (newSearch) => {
      // init an API request
      currentPage.value = 1
      getSearchResults(newSearch, 1);
    });
    watch(currentPage, (newPage) => {
      // init an API request
      getSearchResults(search.value, newPage);
    });
    function getSearchResults(search, page) {
      if (search) {
        let loader = useLoading();
        loader.show({
          color: '#00ab00',
          loader: "bars"
        });
        axios
          .get("/beers", { params: { search: search, page: page } })
          .then((response) => {
            beersList.value = response.data;
            loader.hide()
          })
          .catch((error) => {
            loader.hide()
            toast.error(error?.response?.data?.message || "API Server Error", {
              timeout: 2000,
            });
          });
      } else {
        beersList.value = []
      }

    }
    const toast = useToast();
    // Make it available inside methods
    return { toast, search, beersList, getSearchResults, currentPage };
  },
  mounted() { },
  methods: {
    handleOpenModal(item) {
      this.dialog = true
      this.selectedBeer = item.id
    },
    handleNextPage() {
      this.currentPage++
    },
    handlePrevPage() {
      this.currentPage--
    },
    handleAddComments() {
      console.log(this.rating)
      if (this.rating > 0 && this.selectedBeer) {
        axios.post("/beers/rating/" + this.selectedBeer, {
          rating: this.rating,
          comments: this.comments
        }).then(response => {
          this.dialog = false;
          this.rating = 0;
          this.selectedBeer = null;
          console.log(response)
          this.toast("Thanks. Your rating added successfully.", {
            timeout: 2000,
          });
        }).catch(error => {
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
