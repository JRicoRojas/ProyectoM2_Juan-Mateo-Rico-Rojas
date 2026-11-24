const pgErrors = {
  'authors_email_key': { status: 409, message: "Author email already exists" },
  'posts_author_id_fkey' : { status: 400, message: "Author does not exist" },
};

module.exports = pgErrors;