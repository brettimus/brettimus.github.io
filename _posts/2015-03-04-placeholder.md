---
layout: post
title: "Writing a Placeholder Text Module for Quill.js"
---

## Everything Is Fine.

We mighty devs at Switchboard are in week two of *Le Grand Redesign* (read: a much anticipated *Refacteur*). Things are going really smoothly. 

_Too smoothly._

That is, things were going _too smoothly_ until this week, when I had to deal with using placeholder text in Quill.js, a lovely little rich text editor with a nice-to-play-with API.

This is my story.

## Everything Is Broken.

Currently, Switchboard is using a [Medium-style editor](https://github.com/daviferreira/medium-editor).

It is a nightmare for us, because the editor flat-out does not work in IE or Safari.

As it stands, our editor haunts my dreams :ghost:. 

It is the source of an untold number of support tickets.

It. Must. :fire:.

## Everything Might Not Be Broken.

A few months back, I put [Quill.js](http://quilljs.com/) on our radar after listening to [an interview with Jason Chen](http://www.stitcher.com/podcast/ruby-rogues/javascript-jabber/e/134-jsj-quilljs-with-jason-chen-36034417) on the Javascript Jabber podcast. 

(NB: If you create an issue or submit a PR on the [Quill repo](https://github.com/quilljs/quill), you'll likely end up talking to Jason.)

Quill is not stable yet (v. 0.19.3 at the time of this writing), but it has made some massive improvements in the past few months, the biggest of which was removal of their iframe dependency.

Of course, I was a dumb, and I started out accidentally using an older version of Quill that relied on iframes. (Thanks a lot, outdated asset gem!)

Consequently, I wrote our first pass at an editor while having to deal with all the attendant awfulness of iframes. But thus is life. I got good practice with sending messages to and from an iframe with `window.PostMessage`. Learning occurred. I'm over it. I hope you don't have to do the same in your life.

## Everything Is Still Kind-Of Broken.

I ran into a bit of a bump with implementing placeholder text. I saw one post on a forum where one human had talked about making such a module, but s/z/he never followed up.

Ultimately, I figured I'd roll my own. 

:metal:

## Some Of The Things Are Fixed.

It was easy!

Quill's blog offers [a good tutorial](http://quilljs.com/blog/building-a-custom-module/) on how to write modules for the editor, though I should mention that [the docs](http://quilljs.com/docs/modules/) seem to throw up a cautionary flag that Quill's module interface may change going forward.

Ye been warned.

## Not Bad. Not Good, Either. But Not Bad.

A repo with instructions on how to implement `quill-placeholder` is [here](https://github.com/brettimus/quill-placeholder), in case anyone else runs into this problem.

Something to look out for is that (especially if you're using quill in a Form), you'll need to filter out the placeholder text before form submission (or at least validate against it). I included a mini-scenario addressing this in the README.

It's not clean, but I never said it was going to be.

We just wanted placeholder text, damnit.
