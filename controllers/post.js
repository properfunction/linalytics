const Post = require('../models/Post')
const cloudinary = require('../middleware/cloudinary')
const Comment = require('../models/Comment')

module.exports = {
    getProfile: async (req, res) => {
        try {
            const posts = await Post.find({ user: req.user.id })
            res.render("profile.ejs", { posts: posts, user: req.user }) 
        } catch (error) {
            console.log(err)
        }
    },
    createPost: async (req, res) => {
        try {
            //Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path)

            await Post.create({
                title: req.body.title,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                caption: req.body.caption,
                likes: 0,
                user: req.user.id,
                youtubeId: req.body.youtubeId ? req.body.youtubeId.split('v=')[1] : null, // Extract video ID from YouTube URL if provided by splitting the url into an array an takeing the second elemnt at index [1]
              });
              console.log("Post has been added!");
              res.redirect("/profile");
        } catch (err) {
            console.log(err)
        }
    },
    getFeed: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: "desc" }).lean() // The sort method takes an object as an argument and lean makes queries faster by returning JS objects instead of Mongoose documents
            res.render("feed.ejs", { posts: posts })
        } catch (err) {
            console.log(err)
        }
    },
    getPost: async (req, res) => {
        try {
            // Check if user is logged in
            if (!req.user) {
                return res.redirect('/auth/login'); // or redirect to another page
            }
    
            // Find the post
            const post = await Post.findById(req.params.id);
    
            // If post doesn't exist, show a 404 error
            if (!post) {
                return res.status(404).render("404.ejs", { message: "Post not found." });
            }
    
            // Get the comments related to the post
            const comments = await Comment.find({ post: req.params.id })
                .sort({ createdAt: "desc" })
                .populate('user');  // Populate user details instead of just user ID
    
            // Render the post view with the post, user, and comments
            res.render("post.ejs", { post: post, user: req.user, comments: comments });
        } catch (err) {
            console.log(err);
            res.status(500).render("500.ejs", { message: "Something went wrong." });
        }
    },

    deletePost: async (req, res) => {
        try {
            // Find post by id
            const post = await Post.findById({ _id: req.params.id });
            // Check if post exists
            if (!post) {
                return res.status(404).send("Post not found");
            }
            // Log the Cloudinary ID to confirm it's correct
            console.log('Cloudinary ID to delete:', post.cloudinaryId);
            // Delete the image from Cloudinary
            cloudinary.uploader.destroy(post.cloudinaryId, async (error, result) => {
                if (error) {
                    console.log('Error deleting from Cloudinary:', error);
                    return res.status(500).send('Failed to delete media from Cloudinary');
                }
                // Log the result from Cloudinary
                console.log('Cloudinary deletion result:', result);
                // Delete the post from the database
                await Post.deleteOne({ _id: req.params.id });
                console.log('Post deleted from database');
                // Redirect to the profile page after deletion
                res.redirect('/profile');
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Failed to delete post');
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id); // Find the post by ID
            const userId = req.user.id; // Get the current user's ID

            // Check if the user has already liked the post
            if (post.likedBy.includes(userId)) {
                // Remove user from likedBy array
                post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());   
            } else {
                // Add user to likedBy array 
                post.likedBy.push(userId);
            }

            // Update the likes field with the length of likedBy array
            post.likes = post.likedBy.length;

            // Save the updated post
            await post.save();

            // Redirect back to the post page to update the like count
            res.redirect(`/post/${post._id}`);
        } catch (err) {
            console.log(err);
            res.status(500).send('An error occurred while processing the like');
        }
    }
}