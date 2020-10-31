package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
)

type Disc struct {
	user uint
}

type Column struct {
	discs []Disc
}

func parseColumns(r *http.Request, columns []Column) error {
	defer r.Body.Close()

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Fatal(err)
	}

	return json.Unmarshal(body, &columns)
}

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Got request")

	index := rand.Intn(8)

	fmt.Fprintf(w, "{\"index\": %d}", index)
}
