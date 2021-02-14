package connectfour

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

type Disc struct {
	User uint `json:"user"`
}

type Column struct {
	Discs []Disc `json:"discs"`
}

type MiniMax struct {
	Move  uint    `json:"move"`
	Value float64 `json:"value"`
}

type Request struct {
	Columns    []Column `json:"columns"`
	Difficulty uint     `json:"difficulty"`
}

type Response struct {
	Move            MiniMax       `json:"move"`
	ProcessDuration time.Duration `json:"processDuration"`
}

// Handler Exported http handler
func Handler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Got request")

	startTime := time.Now()

	request := Request{}
	err := parseRequest(r, &request)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Current board:\n%s", formatColumns(&request.Columns))

	move := findNextMove(&request.Columns, request.Difficulty)

	response := Response{
		Move:            move,
		ProcessDuration: time.Since(startTime),
	}
	responseJSON, err := json.Marshal(response)

	if err != nil {
		log.Printf("Error: %v", err)
		log.Fatal(err)
	}

	log.Printf("responseJSON: %s", string(responseJSON))

	fmt.Fprintf(w, string(responseJSON))
}

func parseRequest(r *http.Request, request *Request) error {
	return json.NewDecoder(r.Body).Decode(&request)
}

func randomIndex(columns *[]Column) uint {
	rand.Seed(time.Now().UnixNano())
	randomIndex := uint(rand.Intn(len(*columns)))

	for ; len((*columns)[randomIndex].Discs) >= 8; randomIndex = uint(rand.Intn(len(*columns))) {

	}

	log.Printf("Returning random index %d. Column length: %d", randomIndex, len(*columns))

	return randomIndex
}

func findNextMove(columns *[]Column, level uint) MiniMax {
	move := MiniMax{
		Move:  randomIndex(columns),
		Value: 0,
	}

	if level == 1 {
		move = getBestMove(columns, 1, 3)
	} else if level == 2 {
		move = getBestMove(columns, 1, 5)
	}

	return move
}

func getBestMove(columns *[]Column, startingUser uint, maxDepth uint) MiniMax {
	tempColumns := make([]Column, len(*columns))
	miniMaxes := make([]MiniMax, len(*columns))

	waitGroup := &sync.WaitGroup{}

	for index := range *columns {
		go func(miniMaxes []MiniMax, index int) {
			waitGroup.Add(1)
			defer waitGroup.Done()

			copy(tempColumns, *columns)

			allMoves := tryMoves(tempColumns, 1, uint(index), uint(index), nil, maxDepth, maxDepth)

			miniMaxes[index].Move = uint(index)
			miniMaxes[index].Value = getAverageStrength(&allMoves)
		}(miniMaxes, index)
	}

	waitGroup.Wait()

	move := getStrongestMove(&miniMaxes)

	log.Printf("Minimaxes:\n%v", miniMaxes)

	if allValuesAreEqual(&miniMaxes) {
		move.Move = randomIndex(columns)
	} else {
		log.Printf("Strongest move: %d. Value: %f", move.Move, move.Value)
	}

	return move
}

func tryMoves(columns []Column, userID uint, startColumn uint, index uint, miniMaxes []MiniMax, maxDepth uint, currentDepth uint) []MiniMax {
	tempColumns := make([]Column, len(columns))
	isWinningPosition := false

	if miniMaxes == nil {
		miniMaxes = make([]MiniMax, len(columns))
	}

	if currentDepth > 0 {
		waitGroup := &sync.WaitGroup{}

		for i := 0; i < len(columns); i++ {
			waitGroup.Add(1)

			go func(miniMaxes []MiniMax, i int, startColumn uint) {
				copy(tempColumns, columns)

				tempColumns, isWinningPosition = tryMove(&tempColumns, uint(index), userID)
				strength := getMoveMiniMaxValue(isWinningPosition, userID)

				newMiniMaxes := tryMoves(tempColumns, 1-userID, startColumn, uint(i), miniMaxes, maxDepth, currentDepth-1)
				averageStrength := strength + newMiniMaxes[startColumn].Value

				miniMaxes[startColumn].Value = (miniMaxes[startColumn].Value + averageStrength) / 2

				waitGroup.Done()
			}(miniMaxes, i, startColumn)
		}

		waitGroup.Wait()
	}

	return miniMaxes
}

func getAverageStrength(miniMaxes *[]MiniMax) float64 {
	totalStrength := 0.0

	for _, miniMax := range *miniMaxes {
		totalStrength += miniMax.Value
	}

	return totalStrength / float64(len(*miniMaxes))
}

func getStrongestMove(miniMaxes *[]MiniMax) MiniMax {
	strongestMove := MiniMax{
		Move:  10000,
		Value: -10e9,
	}

	for _, miniMax := range *miniMaxes {
		if miniMax.Value > strongestMove.Value {
			strongestMove = miniMax
		}
	}

	return strongestMove
}

func allValuesAreEqual(miniMaxes *[]MiniMax) bool {
	var value float64 = -10e9

	for _, miniMax := range *miniMaxes {
		if value == -10e9 {
			value = miniMax.Value
		}

		if value != miniMax.Value {
			return false
		}
	}

	return true
}

func getMoveMiniMaxValue(isWinningPosition bool, userID uint) float64 {
	strength := 0.0

	if isWinningPosition {
		if userID == 1 {
			strength = 100.0
		} else {
			strength = -1000.0
		}
	} else {
		strength = -0.1
	}

	return strength
}

func tryMove(columns *[]Column, index uint, userID uint) ([]Column, bool) {
	columnCanFitMoreDiscs := len((*columns)[index].Discs) < 8
	if columnCanFitMoreDiscs {
		var disc Disc
		disc.User = userID

		(*columns)[index].Discs = append((*columns)[index].Discs, disc)

		return *columns, hasWinningPosition(columns)
	}

	return *columns, false
}

func hasWinningPosition(columns *[]Column) bool {
	for _, column := range *columns {
		if columnHasWinningPosition(&column) {
			return true
		}
	}

	for i := 0; i < 8; i++ {
		if rowHasWinningPosition(columns, i) {
			return true
		}
	}

	return isDiagonalWin(columns)
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

func isDiagonalWin(columns *[]Column) bool {
	maxNumberOfRows := 8
	// x := -1
	// y := -1
	// xtemp := -1
	// ytemp := -1
	var currentDisc Disc = Disc{}
	var previousDisc Disc = Disc{}
	var currentColumn Column = Column{}
	discsInARow := 1

	// Test for down-right diagonals across the top.
	for x := range *columns {
		xtemp := x
		ytemp := 0

		for xtemp < len(*columns) && ytemp <= maxNumberOfRows {
			currentColumn = (*columns)[xtemp]

			if len(currentColumn.Discs) > ytemp {
				currentDisc = currentColumn.Discs[ytemp]

				if (previousDisc != Disc{}) && currentDisc.User == previousDisc.User {
					discsInARow++
				} else {
					discsInARow = 1
				}

				if discsInARow == 4 {
					return true
				}

			}

			previousDisc = currentDisc

			xtemp++
			ytemp++
		}

		discsInARow = 0
		previousDisc = Disc{}
	}

	// Test for down-left diagonals across the top.
	for x := range *columns {
		xtemp := x
		ytemp := 0

		for 0 <= xtemp && ytemp <= maxNumberOfRows {
			currentColumn = (*columns)[xtemp]

			if len(currentColumn.Discs) > ytemp {
				currentDisc = currentColumn.Discs[ytemp]

				if (previousDisc != Disc{}) && currentDisc.User == previousDisc.User {
					discsInARow++
				} else {
					discsInARow = 1
				}

				if discsInARow == 4 {
					return true
				}

			}

			previousDisc = currentDisc

			xtemp--
			ytemp++
		}

		discsInARow = 0
		previousDisc = Disc{}
	}

	// Test for down-right diagonals down the left side.
	for y := range *columns {
		xtemp := 0
		ytemp := y

		for xtemp < len(*columns) && ytemp <= maxNumberOfRows {
			currentColumn = (*columns)[xtemp]

			if len(currentColumn.Discs) > ytemp {
				currentDisc = currentColumn.Discs[ytemp]

				if (previousDisc != Disc{}) && currentDisc.User == previousDisc.User {
					discsInARow++
				} else {
					discsInARow = 1
				}

				if discsInARow == 4 {
					return true
				}

			}

			previousDisc = currentDisc

			xtemp++
			ytemp++
		}

		discsInARow = 0
		previousDisc = Disc{}
	}

	// Test for down-left diagonals down the right side.
	for y := range *columns {
		xtemp := len(*columns) - 1
		ytemp := y

		for 0 <= xtemp && ytemp <= maxNumberOfRows {
			currentColumn = (*columns)[xtemp]

			if len(currentColumn.Discs) > ytemp {
				currentDisc = currentColumn.Discs[ytemp]

				if (previousDisc != Disc{}) && currentDisc.User == previousDisc.User {
					discsInARow++
				} else {
					discsInARow = 1
				}

				if discsInARow == 4 {
					return true
				}

			}

			previousDisc = currentDisc

			xtemp--
			ytemp++
		}

		discsInARow = 0
		previousDisc = Disc{}
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
			return true
		}
	}

	return false
}

func formatColumns(columns *[]Column) string {
	rows := make([][]string, 8)
	rowsFormatted := ""

	for i := range rows {
		rows[i] = make([]string, 8)
		row := rows[i]

		for j := range row {
			column := (*columns)[j]
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
