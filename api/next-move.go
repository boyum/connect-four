package handler

import (
	"encoding/json"
	"fmt"
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

func getJson(r *http.Request, target interface{}) error {
	defer r.Body.Close()

	return json.NewDecoder(r.Body).Decode(target)
}

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	columns := []Column{}
	err := getJson(r, columns)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Columns: %#v", columns)
	log.Printf("%d", len(columns))
	index := rand.Intn(len(columns))

	fmt.Fprintf(w, "{\"index\": %d}", index)
}
