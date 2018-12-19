# my-resume-website

The source code for my website resume, responsive for mobile devices. built with pure javascript (ecmascript6) from scratch and transpiled with babel for backwards compatibility for older browsers, using HTML5 semantics and CSS3. 
The website uses github api V4 (Graphql) to extract my github projects using a token that was created with only reading credentials so can only be used for reading (hence why I dont care that it's used in frontend and not in backend for people to see it).

## Resume file

The resume file is downloaded without opening a new window, at first I tried it using javascript but some internet explorer versions would not support it (forgot the reason for now) so instead I used the HTML5 download attribute, and to support old internet explorer versions I defined in my http server (apache2) the following:

```shell script
<FilesMatch "\.(?i:pdf)$">
  Header set Content-Disposition attachment;
  Header set Content-Type: application/pdf;
</FilesMatch>
```

which tells the HTTP header response that a file will be downloaded so the anchor element in the HTML file will know its not a link for a new page to open.

## Github Api

In previous iterations I tried using Github api V3 with it's support for CORS and Jsonp, On the one hand Jsonp wasn't sufficient due to its inherit lack of support for custom HTTP headers (as its a script) which are needed to extract topics for repositories in V3, which I wanted to display on my projects, and on the other hand CORS did not work on some versions of internet explorer due to the reason that HTTP requests in that browser are restricting the [Same Origin Policy](https://en.wikipedia.org/wiki/Same-origin_policy) and will only allow such requests if and only if both ends of the request use HTTPS protocol (which my website lacks), there are some solutions [for example](http://blog.gauffin.org/2014/04/how-to-use-cors-requests-in-internet-explorer-9-and-below/) but they feel like a hack.

So instead I decided to use Github API V4 that uses Grpahql, it uses CORS as well so to support internet explorer 9 I will need to enable HTTPS on my website.

![](https://i.imgur.com/6HAkBib.png)
