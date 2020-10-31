package handler

import (
	"fmt"
	"math/rand"
	"net/http"
)

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	index := rand.Intn(8)

	fmt.Fprintf(w, "{\"index\": %d}", index)
}
