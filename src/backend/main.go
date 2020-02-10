package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gorilla/mux"
	"gopkg.in/russross/blackfriday.v2"
)

type Content struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

func parseBlogContent(content []byte) ([][]byte, error) {
	r := regexp.MustCompile(`(?s)^\+\+\+\ntitle[ ]*=[ ]*"(.*)"\n\+\+\+\n(.*)`)
	b := r.FindSubmatch(content)

	if len(b) == 3 {
		return [][]byte{b[1], b[2]}, nil
	} else {
		return nil, fmt.Errorf("Parse Error")
	}

}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		files, err := ioutil.ReadDir("./articles")
		if err != nil {
			log.Fatal(err)
		}
		titles := []string{}

		for _, f := range files {
			if err != nil {
			}

			titles = append(titles, f.Name()[:len(f.Name())-3])
		}

		j, err := json.Marshal(titles)
		if err != nil {

		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(j)
	})

	r.HandleFunc("/articles/{article}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		content, err := ioutil.ReadFile("./articles/" + vars["article"] + ".md")
		if err != nil {
			w.WriteHeader(404)
			w.Header().Set("Access-Control-Allow-Origin", "*")
			io.WriteString(w, "404 Not Found.\n")
			return
		}

		c, err := parseBlogContent(content)
		if err != nil {
			w.WriteHeader(500)
			w.Header().Set("Access-Control-Allow-Origin", "*")
			io.WriteString(w, "Parse Error")
			return
		}

		title := string(c[0])
		html := string(blackfriday.Run(c[1]))
		j, err := json.Marshal(Content{title, html})
		if err != nil {

		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(j)
	})

	host := os.Getenv("BACKEND_HOST")
	port := os.Getenv("BACKEND_PORT")
	srv := &http.Server{
		Handler:      r,
		Addr:         host + ":" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
