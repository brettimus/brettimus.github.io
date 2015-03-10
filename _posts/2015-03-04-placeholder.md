---
layout: post
title: "Writing a Placeholder Text Module for Quill.js"
---

## Everything Is Fine.

We mighty devs at Switchboard are in week two of _Le Grand Redesign_ (which is very much _Un Grand Refacteur_ at this point). Things are going really smoothly. At least they are for me. At least they were for me. Until I got around to redoing our text editor.

One thing I had to deal with was figuring out how to use placeholder text with Quill.js.

This is my story.

## Everything Is Broken.

In the current, production version of Switchboard, we are using a Medium-style editor.

It is a nightmare. 

It haunts my dreams :ghost:. 

It is the source of an untold number of support tickets.

It must die. 

## Everything Might Not Be Broken.

A few months back, I put [Quill.js](http://quilljs.com/) on our radar after listening to [this episode of javascript jabber](http://www.stitcher.com/podcast/ruby-rogues/javascript-jabber/e/134-jsj-quilljs-with-jason-chen-36034417), which interviews Jason Chen. 

(If you create an issue or submit a PR on the [Quill repo](https://github.com/quilljs/quill), you'll likely end up talking to Jason.)

Quill is not stable yet (v. 0.19.3 at the time of this writing), but it has made some massive improvements in the past few months, the biggest of which was removal of their iframe dependency.

Of course, I was a dumb, and I started out using an older version of Quill. Because Switchboard runs on Rails (toot toot!), I went straight to the first asset gem I could find. It was out of date :disappointed:.

I wrote our first pass at a customized editor having to deal with all the attendant awfulness that iframes come with. But thus is life. I got good practice with sending messages to and from an iframe with `window.PostMessage`. Learning occurred. I'm over it. I hope you don't have to do the same.

## Everything Is Still Kind-Of Broken.

Now, about this redesign. 

We had the fortune of a code-savvy freelance designer, so most of our initial work has been converting his `haml` to `erb` (thanks be to [this site](https://haml2erb.org/)) and plugging our app's view logic into his beautiful templates.

I had to add a few hacky styles to get our Quill editor to look like the textareas in his designs. (This was much easier once I redid the editor _without_ the iframe dependency.)

We ran into a bit of a bump with placeholder text, though. I saw one post on a forum where someone had talked about making such a module, but s/he never followed up.

Ultimately, I figured I'd roll my own. 

:metal:

## Some Of The Things Are Fixed.

It was easy.

Quill's blog offers [a good tutorial](http://quilljs.com/blog/building-a-custom-module/) on how to write modules for the editor, though [the docs](http://quilljs.com/docs/modules/) seem to throw up a cautionary flag that Quill's module interface may change going forward.

Ye been warned.

## Not Bad. Not Good, Either. But Not Bad.

A repo with instructions on how to implement `quill-placeholder` is [here](https://github.com/brettimus/quill-placeholder), in case anyone else runs into this problem.

Something to look out for is that (especially if you're using quill in a Form), you'll need to filter out the placeholder text before form submission (or at least validate against it). I included a mini-scenario addressing this in the README.

It's not clean, but I never said it was going to be.

We just wanted placeholder text, damnit.
