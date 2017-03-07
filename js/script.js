
///VIEW STUFF
var setHomePage = function(){
	var containerNode = document.querySelector('.pageContent')
	var html = ''
		html += '<p>Etsy</p>'
		containerNode.innerHTML = html
}
var DetailsView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'sync', this._render)
	},
	_render: function() {
		console.log("detailsView model", this.model)

		var containerNode = document.querySelector('.pageContent')
		var html = ''
		html += '<h2>' + this.model.get('title') + '</h2>'
		html += '<img class="img-responsive thumbnail" src="' + this.model.get('MainImage').url_570xN + '">'
		html += '<p>' + this.model.get('description') + '</p>'
		html += '<button>' + '$' + this.model.get('price') + '</button>'


		// if(this.model.get('ADD SOMETHING HERE')){
		// 	this.model.get('ADD SAME THING HERE').forEach(function(listingItem){
		// 		if(listingItem.subtype === 'IMAGE TYPE'){
		// 			html += '<img src="etsy link here' + linkItem.url + '">'
		// 		}
		//	})
		containerNode.innerHTML = html
	}
})

var HomeView = Backbone.View.extend({
	initialize: function(){
		document.querySelector('.pageContent').innerHTML = '<INSERT LOADING GIF LINK>'
		this.listenTo(this.collection, 'sync', this._render)
	},
	_render: function() {
		var containerNode = document.querySelector('.pageContent')
		var html = ''

		html += '<div class="mainPic"><div class="siteName">THE HOMEMADE STORE</div></div>'

		this.collection.forEach(function(inputModel){
			console.log("inputModel", inputModel)
			html += '<div class="col-xs-3" id="listing">' + '<a href="#detail/' + inputModel.get('listing_id') + '">' + '<img class="img-responsive thumbnail" src="' + inputModel.get('MainImage').url_170x135 + '">'+"</a>"
			html += '<a href="#detail/' + inputModel.get('listing_id') +'">' + inputModel.get('title') + '</a>'
			html += '</div>'
		})
		containerNode.innerHTML = html
	}
})


var ListView = Backbone.View.extend({
	initialize: function(){
		document.querySelector('.pageContent').innerHTML = '<INSERT LOADING GIF LINK>'
		this.listenTo(this.collection, 'sync', this._render)
	},
	_render: function() {
		var containerNode = document.querySelector('.pageContent')
		var html = ''

		this.collection.forEach(function(inputModel){
			console.log("inputModel", inputModel)
			html += '<div class="col-xs-3" id="listing">' + '<a href="#detail/' + inputModel.get('listing_id') + '">' + '<img class="img-responsive thumbnail" src="' + inputModel.get('MainImage').url_170x135 + '">'+"</a>"
			html += '<a href="#detail/' + inputModel.get('listing_id') +'">' + inputModel.get('title') + '</a>'
			html += '</div>'
		})
		containerNode.innerHTML = html
	}
})

var searchNode = document.querySelector('.search')
searchNode.addEventListener('keydown', function(eventObj) {
	if(eventObj.keyCode === 13) {
		var input = eventObj.target.value //take the input from the search bar
		location.hash = 'search/' + input //make that input become the url after the hashtag
		eventObj.target.value = ''
	}
})

//MODELS (COLLECTIONS)
var EtsyCollection = Backbone.Collection.extend({
	url: 'https://openapi.etsy.com/v2/listings/active.js',
	parse: function(apiResponse){

		console.log("apiResponse", apiResponse)
		//parse takes in the api response and will return the array that we want 
		return apiResponse.results
	}
})

var EtsyModel = Backbone.Model.extend({
	parse: function(apiResponse){
		return apiResponse.results[0]
	}
})

//CONTROLLER
var EtsyRouter = Backbone.Router.extend({
	routes: {
		"search/:query" : "showSearches",
		"detail/:listing_id" : "showDetailPage",
		"" : "showHomePage"
	},
	showHomePage: function(){
		var collectionInstance = new EtsyCollection()
		console.log(collectionInstance)
		var promise = collectionInstance.fetch({
			dataType: 'jsonp',
			data: {
				includes: 'Images,MainImage',
				'api_key': 'ayhxghvva4um3zjemhg60emb'
			}
		})

		var viewInstance = new HomeView({
			collection: collectionInstance
		})
	},
	showSearches: function(query){
		var collectionInstance = new EtsyCollection()
		console.log(collectionInstance)
		var promise = collectionInstance.fetch({
			dataType: 'jsonp',
			data: {
				keywords: query,
				includes: 'Images,MainImage',
				'api_key': 'ayhxghvva4um3zjemhg60emb'
			}
		})

		var viewInstance = new ListView({
			collection: collectionInstance
		})
	},
	showDetailPage: function(listing_id) {
		var modelInstance = new EtsyModel() //new instance of model
		var promise = modelInstance.fetch({
			url: 'https://openapi.etsy.com/v2/listings/' + listing_id + '.js',
			dataType: 'jsonp',
			data: {
				includes: 'Images,MainImage',
				'api_key': 'ayhxghvva4um3zjemhg60emb'
			}
		})
		new DetailsView({
			model: modelInstance
		})
	}
})

var instance = new EtsyRouter()
Backbone.history.start()