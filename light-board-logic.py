
""" 
light board rows 

5 x 5 cube 
drawing an E  

# 0 represents off 
# 1 represents on 
# all the switches are off 

row, col  

""" 
#print(_2D_lst)
from pprint import pprint 


row1 = [0,0,0,0,0]
row2 = [0,0,0,0,0]
row3 = [0,0,0,0,0]
row4 = [0,0,0,0,0]
row5 = [0,0,0,0,0]
#print(lst)

_2D_lst = [
	row1, 
	row2,
	row3, 
	row4,
	row5]

 

# put everything in functions
def draw_board():
	"""	
	Draws the board  
	"""
	# print each row 
	for row in _2D_lst:
		print(row)

	# visible aid 
	print("--------------\n")
# draw an E 
def draw_e():	

	# set first row equal to 1
	row1_idx = [(0,0),(0,1),(0,2),(0,3),(0,4)] 
	row3_idx = [(2,0),(2,1),(2,2),(2,3),(2,4)] 
	row5_idx = [(4,0),(4,1),(4,2),(4,3),(4,4)] 
	
	# iterates over the row1 idx and 
	# only light up these two 
	col1_idx = [(1,0), (3,0)]
	col4_idx = [(0,4), (2, 4), (4,4)]
	# only light up these two 
	col1_idx = [(1,0), (3,0)]
	col4_idx = [(0,4), (2, 4), (4,4)]
	# set first row to 1 
	for row_, col_ in row1_idx:
		# set equal to 1 
		_2D_lst[row_][col_] = 1 

	# set third row to 1 
	for row_, col_ in row3_idx:
		# set equal to 1 
		_2D_lst[row_][col_] = 1 

	# set fifth row to 1 
	for row_ , col_ in row5_idx:

		# set equal to 1 
		_2D_lst[row_][col_] = 1 


	# light up column 
	for row_ , col_ in col1_idx:
		_2D_lst[row_][col_] = 1 

	# turn off last column
	for row_, col_ in col4_idx:
		_2D_lst[row_][col_] = 0 


draw_board()
draw_e()
draw_board()







