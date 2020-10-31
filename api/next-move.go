package handler

import (
	"fmt"
	"net/http"
)

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "{\"index\": 0}")
}
