from tripwebsite import ma

class TripSchema(ma.Schema):
	class Meta:
		fields = ('id', 'name', 'category', 'description', 'address', 'transport', 'mrt', 'latitude', 'longitude', 'images')


# init Schema
tripSchema = TripSchema(many=True)
