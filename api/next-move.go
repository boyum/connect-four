package connectfour

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"
)

type Disc struct {
	User uint `json:"user"`
}

type Column struct {
	Discs []Disc `json:"discs"`
}

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Got request")

	columns := []Column{}
	err := parseColumns(r, &columns)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Current board:\n%s", formatColumns(columns))

	index := findNextMove(&columns, 1)

	fmt.Fprintf(w, "{\"index\": %d}", index)
}

func parseColumns(r *http.Request, columns *[]Column) error {
	return json.NewDecoder(r.Body).Decode(&columns)
}

func randomIndex(columns *[]Column) uint {
	rand.Seed(time.Now().UnixNano())
	randomIndex := uint(rand.Intn(len(*columns)))

	for ; len((*columns)[randomIndex].Discs) >= 8; randomIndex = uint(rand.Intn(len(*columns))) {

	}

	log.Printf("Returning random index %d. Column length: %d", randomIndex, len(*columns))

	return randomIndex
}

func findNextMove(columns *[]Column, level uint) uint {
	var index uint = 0

	if level == 0 {
		index = randomIndex(columns)
	}

	if level == 1 {
		index = tryMoves(*columns)
	}

	return index
}

func tryMoves(columns []Column) uint {
	tempColumns := make([]Column, len(columns))

	for index := range columns {
		copy(tempColumns, columns)
		log.Printf("Temp columns: %v", tempColumns)

		if tryMove(tempColumns, index) {
			log.Printf("Found winning move: %d", index)

			return uint(index)
		}
	}

	return randomIndex(&columns)
}

func tryMove(columns []Column, index int) bool {
	columnCanFitMoreDiscs := len(columns[index].Discs) < 8
	if columnCanFitMoreDiscs {
		var disc Disc
		disc.User = 1

		columns[index].Discs = append(columns[index].Discs, disc)

		return hasWinningPosition(&columns)
	}

	return false
}

func hasWinningPosition(columns *[]Column) bool {
	log.Printf("Checking board\n%s", formatColumns(*columns))

	for index, column := range *columns {
		if columnHasWinningPosition(&column) {
			log.Printf("Column %d has winning position", index)
			return true
		}
	}

	for i := 0; i < 8; i++ {
		if rowHasWinningPosition(columns, i) {
			return true
		}
	}

	return false
}

func columnHasWinningPosition(column *Column) bool {
	var discsInARow uint = 1
	var previousUser uint = 1000000

	for _, disc := range column.Discs {
		if previousUser == disc.User {
			discsInARow++
		} else {
			discsInARow = 1
		}

		previousUser = disc.User

		isWinningPosition := discsInARow > 3
		if isWinningPosition {
			return true
		}
	}

	return false
}

func rowHasWinningPosition(columns *[]Column, rowIndex int) bool {
	var discsInARow uint = 1
	var previousUser uint = 1000000

	for _, column := range *columns {
		if len(column.Discs) > rowIndex {
			disc := column.Discs[rowIndex]

			if previousUser == disc.User {
				discsInARow++
			} else {
				discsInARow = 1
			}

			previousUser = disc.User
		} else {
			previousUser = 1000000
		}

		isWinningPosition := discsInARow > 3
		if isWinningPosition {
			log.Printf("Row %d has winning position", rowIndex)
			return true
		}
	}

	return false
}

func formatColumns(columns []Column) string {

	rows := make([][]string, 8)
	rowsFormatted := ""

	for i := range rows {
		rows[i] = make([]string, 8)
		row := rows[i]

		for j := range row {
			column := columns[j]
			if len(column.Discs) > i {
				row[j] = fmt.Sprintf("%d", column.Discs[i])
			} else {
				row[j] = " - "
			}
		}
	}

	for i := 7; i >= 0; i-- {
		rowsFormatted += fmt.Sprintf("%v\n", rows[i])
	}

	return fmt.Sprintf(`
---------------------------------
%s---------------------------------
	`, rowsFormatted)
}
