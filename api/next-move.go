package handler

import (
	"encoding/json"
	"fmt"
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

	index := rand.Intn(len(columns))

	fmt.Fprintf(w, "{\"index\": %d}", index)
}
