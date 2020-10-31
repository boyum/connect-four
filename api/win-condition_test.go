package connectfour

import "testing"

func Test_columnHasWinningPosition(t *testing.T) {

	type args struct {
		column *Column
	}

	type testCase struct {
		name string
		args args
		want bool
	}
	tests := []testCase{
		testCase{
			name: "No discs, no win",
			args: args{column: &Column{Discs: []Disc{}}},
			want: false,
		},
		testCase{
			name: "Broken streak, no win",
			args: args{column: &Column{Discs: []Disc{
				Disc{User: 0},
				Disc{User: 0},
				Disc{User: 0},
				Disc{User: 1},
				Disc{User: 0},
			}}},
			want: false,
		},
		testCase{
			name: "Four in a row, win",
			args: args{column: &Column{Discs: []Disc{
				Disc{User: 1},
				Disc{User: 0},
				Disc{User: 0},
				Disc{User: 0},
				Disc{User: 0},
				Disc{User: 1},
			}}},
			want: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := columnHasWinningPosition(tt.args.column); got != tt.want {
				t.Errorf("hasVerticalWin() = %v, want %v", got, tt.want)
			}
		})
	}
}
