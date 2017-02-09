# url-shortener
A URL shortener! (Sort of. Heroku kinda has long URL's...)

## Usage
https://znurls.herokuapp.com/ is the main endpoint. Pass in a valid URL that begins with "http://" or "https://", like so `https://znurls.herokuapp.com/https://znurls.herokuapp.com/` and you will receive a JSON response in this format:
```
{
  "original": "https://znurls.herokuapp.com/",
  "short": "https://znurls.herokuapp.com/1"
}
```
Visit the "short"* url and you will be redirected to the original site!

*The url might not actually be "shorter," because this is a simple project and the url will contain ".herokuapp.com"
