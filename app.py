from tripwebsite import create_app

app = create_app('development')

if __name__ == '__main__':
	app.run(port=3000)

# host="0.0.0.0", 
