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
	getJson(r, columns)

	log.Printf("Columns: %#v", getJson(r, columns))
	log.Printf("Columns 2: %#v", columns)
	log.Printf("%d", len(columns))
	index := rand.Intn(len(getJson(r, columns)))

	fmt.Fprintf(w, "{\"index\": %d}", index)
}
