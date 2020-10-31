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

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Got request")

	columns := []Column{}
	err := parseColumns(r, &columns)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Columns: %#v", columns)
	log.Printf("%d", len(columns))
	index := findNextMove(&columns, 0)

	fmt.Fprintf(w, "{\"index\": %d}", index)
}

func parseColumns(r *http.Request, columns *[]Column) error {
	defer r.Body.Close()

	body, err := ioutil.ReadAll(r.Body)

	log.Printf("Body: %s", string(body))

	if err != nil {
		log.Fatal(err)
	}

	return json.Unmarshal(body, &columns)
}

func randomIndex(columns *[]Column) uint {
	return uint(rand.Intn(len(*columns)))
}

func findNextMove(columns *[]Column, level uint) uint {
	var index uint = 0

	if level == 0 {
		index = randomIndex(columns)
	}

	if level == 1 {

	}

	return uint(index)
}

func tryMoves(columns []Column) uint {
	for i := 0; i < len(columns); i++ {

		if tryMove(columns, i) {
			return uint(i)
		}
	}

	return randomIndex(&columns)
}

func tryMove(columns []Column, index int) bool {
	column := (columns)[index]

	columnCanFitMoreDiscs := len(column.discs) < 8

	if columnCanFitMoreDiscs {
		var disc Disc
		disc.user = 1

		column.discs = append(column.discs, disc)

		return hasWinningPosition(&columns)
	}

	return false
}

func hasWinningPosition(columns *[]Column) bool {
	for _, column := range *columns {
		return hasVerticalWin(&column)
	}

	return false
}

func hasVerticalWin(column *Column) bool {
	var discsInARow uint = 1
	var previousUser uint = 1000000

	for _, disc := range column.discs {
		if previousUser == disc.user {
			discsInARow++
		} else {
			discsInARow = 1
		}

		previousUser = disc.user

		isWinningPosition := discsInARow > 3
		if isWinningPosition {
			return true
		}
	}

	return false
}
