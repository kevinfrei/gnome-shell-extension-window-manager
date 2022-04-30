# The beginnings of a Gnome (Wayland!) window mover thingamajig

Configure your monitor into regions, and bind keys to move the current window
into a given region. Imagine that!

## THIS IS NOT YET WORKING

### What I want:

Some simple text configuration that let's me specify one of two things:

- Position: Set the current window's size & position, relative to the current
  monitor it's on
- Move: Move the current window to the "next" or "previous" monitor.

That's it. Each Position needs an X, Y, Width, and Height. Each Move just needs
a "Prev" or "Next" setting. They both need a keyboard binding.

I could, eventually, enable some sort of 'auto layout' (which I have on my macOS
Hammerspoon config for the laptop display) but that's a low priority, currently.

### What I currently have:

Nothing. I've got this README rant (seriously: go read the rant below) and
nothing working. I don't actually know if I can do precisely what I want, but
I'll probably try, because I'm a glutton for punishment...

## Install

I need to kill this and move everything into the package.json file.

```
make install
```

Log out, log back in

### Credit where credit is due

This was shamelessly forked from the "Arrange Windows" Gnome extensions. If you
want something to auto-cascade or tile your windows, go use that. It looks like
it's what you'd want.
[Arrange Windows](https://extensions.gnome.org/extension/1604/arrange-windows/)

### Background

I spent 15+ years in a Windows only world. Using the keyboard to move windows
around is reasonably good there (and they've made it better since I moved on).
Then, I switched macOS, and it really sucked. But I came across
[HammerSpoon](https://hammerspoon.org) which let me build out keyboard
capabilities to move windows around. Then I got an ultrawide monitor, and it
became even more of a big deal. Then I wound up back on Linux, and I find myself
moving between macOS, Windows, and Linux somewhat regularly. I cannot, for the
life of me, find a decent way to bind a set of keys to move windows around in
the Gnome Shell (Wayland: I had it working with X just fine). So I'm writing a
Gnome Shell extension...in Typescript because types are good (and apparently the
Gnome people have, not surprisingly, had their head in a hole for the past 10
years, because they seem to be confused that people might want to write
Typescript instead of their flavor of Javascript).

At the end of the day, there just aren't that many super users that go between
the 3 big operating systems, _and it shows_. Most super users pick an ecosystem,
and seem to keep their head in the sand about how their non-preferred OS might
have capabilities that their OS of choice doesn't. It's pretty stupid, but it's
just the tech-flavor of religion, and religion's been crapping all over humanity
for millenia, so it's really not that surprising. This isn't just the case in
the "how to adapt my OS to my needs" space, but in all sorts of deep technical
areas! My own background is compilers, and the amount of truly amazing tech that
Microsoft has had _for years_ that just _wasn't there_ in Linux/macOS was
astounding. And, as I learned more of the Linux/macOS toolchain, it turns out
there's lots of stuff that Window's tools would really benefit from. But nope,
everyone lives in their own little world and thinks they're superior for a
narrow set of reasons, without realizing that if they'd only look around, they
could demand (and build) better. Humans is so dumbs...
