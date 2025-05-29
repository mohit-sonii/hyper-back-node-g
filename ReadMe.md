<h3>Hyper Gro Backend</h3><br><br>
<h2>auth.controller.ts</h2><br>

<p><b>Register:</b> This is responsible to register a user in the database, it will accpet two fields one is password and other one is email. It first try to find the user with the email if a user exists it return 409 status code and will not proceed further. Else it will hash the password for security reason and will store the user in the DB
</p><br>
<p><b>login:</b> This is responsible to login the user with the same credentials that we require to register the user. at first we will check whether the user has token or not in cookies, if yes then try to validate the token if token is valid that means it is the same user that is trying to access the same route. so do return from that, lese if the user does not have token first find the user with the given email, if found generate a token and authenticate him.</p>
<br><br>

<h2>favorite.controller.ts</h2><br>

<p><b>addFav:</b> This is responsible to add the favorite property in to the logged user favorite list. it will accept the two args from params one is user id and other one is prop_id which is for property id, it first validate that whether they both are avaiable or not. if yes then only move forward and then do add the property id in the favorite array of the User field</p><br>

<p><b>getFav:</b> This is response to get all the favorite that the user marked them as favorites, it accept one params argument user_id and will search the user first, then we know we are storing property IDs in the fav array in user table, so we do need to fetch all the propeties from their IDs, and this willbe done in map and after that we must remove the null, undefined fields and for that we need to filter it with Boolean argument that will remove all those fields. Then simply return the valid results</p><br>

<p><b>removeFav:</b> This is responsible to remove the Favorite from the User field. Similar to <b>addFav</b> but just we are using <b>$pull</b> instead of <b>$push</b> </p><br><br>


<h2>property.controller.ts</h2><br>
<p><b>addProperty</b> This is responsible to add the property in the database, I first need to validate whether the token has or not, if yes do find the generate a new id and add that in the DB of property, After than do update the User property array list, to add the id in the property array which means this property is blongs to that user</p><br>

<p><b>updateProperty</b> This is responsible to update the property field, I am using patch as of now and will work similar to add property method but this time we are updating it, and for that we first need to validate the user and then check whether the user is present or not, then check in order to update it he should himself the creator of that property so we will check it from that and if yes, then update with what we get from request.body we put into it.</p><br>

<p><b>deleteProperty</b> Much similar with the update all the process will be same but just we need to pull the id of the property from the User.properties field and to remove the data from the proeprties table as well</p><br>

<p><b>getProperty</b> Take the property id from the params and then find it with id in the property table if found return the data else return not found</p><br>

<p><b>searchProperty</b> This will take all the possible entries in the params and will do seraching ont eh basis of their existence as of now we dont know whether a particualr entry is needed for serach or not, so we will do check for each entry and if the entry value is present in the params means we need to add this in our search so add that in the newly created object and then do pass the newly result in the find method and the mongodb will do the filter form that object. and then return the reuslt</p><br><br>


<h2>recommend.controller.ts</h2><br>

<p><b>findUser</b> We do find the user with their email, we do a post request where body will have email field, and we do a findOne with email and if a user is prenetn return its id and email only, else return not found</p><br>

<p><b>recommed</b> This is responsible to recommed the user a property and this requires 3 items in params one is user_id which is hte current user, prop_id which is the proeprty Id you want o recommed, rec_user_id the id of that you want to refer. First do accept those from params, then do authentication as we were doing before, Then do find all the id data, it is necessary that all should present, if everything is okay then do add the field in that user/ recipient recommeded array. then do save it</p><br>

<p><b>getRecommendations</b> This is to get the recommendations array meaning recommadations recieved, it will be an arrya of peroperty Id so we need to fetch the property as well from that ID, There is also a filter that will keep track whether the result has null or not, if yes it will remove it else it will keep it.</p><br><br>

<h2>auth.middleware.ts</h2><br>

<p><b>authMiddleware</b> This is the authentication middleware that will handle the authentication. First we do check whether we have cookies orn ot, if yes then validate it, and if valid then do check on redis server, if both matches means its a match do move forward elses do not. If the user does not have cookies means its unauthenticated</p><br><br>

<h2>User.model.ts</h2><br>

<p>The inital user schema that will hold the user data and it includes the array of properties which user has created, array of favoritei which user mark the property is, and the recommendation received if someone recommend a property to some user it will store from  which is the sender user id and the property id which is recommeded by that sender.</p><br><br>

<h2>Property.model.ts</h2><br>
<p>SH there is no such relation in the Prperty model other that referencing the User </p><br><br>

<h2>Counter.model.ts</h2><br>
<p>This is not sotring data it is maintaing the proprety id which needs to be stored in one of the enty in Property. it only include one seq number having default value of 1000, The usage is alreayd discussed in <b>addProperty.controller.ts</b></p><br><br>

<h2>auth.route.ts</h2><br>
<p>It includes the routes that calls the desired methods on specific route calling, in the auth route I have register and login that calls their own methods</p><br>

<h2>Rest routes file have comments, check direclty</h2></p><br><br>

<h2>CounterPropertyValue.util.ts</h2><br>
<p>This is responsible to generate a string id in a serial order, I have findOneAndUpdate method that will find the field and update it will a new id, so that it can make a serial order when called again, I am increasing the <b>seq</b> by 1 and update it with the `new` true so that it update in place, the `upsert` make the field if not exists then eliminate the runtime error that may be thrown if not handled this, then simply we try to make a string with the new value that we have in the newCounter field. and then reutrn it.</p><br><br>

<h2>redis.ts</h2><br>
<p>This will connect the redis server to managed online redis database</p>
<br><br>

<h2>tokenCookieRedis.util.ts</h2><br>
<p><b>generateToken</b> IT will generate token and store it in the cookie as well as in the redis database, it accept only response and user_id which is currently online.</p><br>

<p><b>validateToken</b> It is to validate the token it returns an object of JWT type that will include a string only variable but if it throws an erorr it will reutnr null.</p><br><br>

<h2>app.ts</h2><br>
<p>The main entry point of the application. The is responsible to navigate the routes and to conenct the server which is on mongodb Atlas. </p>