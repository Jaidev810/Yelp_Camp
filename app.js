var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash");
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campgrounds"),
    Comment       = require("./models/comment"),
    seedDB        = require("./seeds"),
    methodOverride = require("method-override"),
    User          = require("./models/user");

var commentRoutes    = require("./routes/comments");
    campgroundRoutes = require("./routes/campgrounds");
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb+srv://jaidev:jaidev@cluster0-olo2g.mongodb.net/test?retryWrites=true&w=majority",{
    
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(() =>console.log('connected to database...'))
    .catch(err => console.log('refuse to connect..', err));



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());




//seedDB(); seed the database

//passport configuration
app.use(require("express-session")({
    secret: "jaidev",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(3004, function(){
   console.log("The YelpCamp Server Has Started!");
});