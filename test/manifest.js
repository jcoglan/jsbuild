JS.packages(function() { with(this) {
  file('https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.js')
    .provides('jQuery')

  file('/common.js')
    .provides('Common')
    .styling('/a/b/c/c.css')
}})
