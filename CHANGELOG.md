# Changelog

## next

- electron 0.37 (chrome 49)
- logarithmic scaling (log10) support added to knob, fader & xy
- mousewheel support added to knob and fader (ctrlKey for fine control)
- new widgets : plot & visualizer
- traversing gestures switch in sidepanel
- widget categories in editor's context menu
- sync/link event handling improved
- many small optimizations...

## 0.3.1

- electron updated to 0.36.11
- editor paste menu lets you choose between `Same ID` (cloned widgets) or `New ID` (resets id, label, linkId, and path)
- minor style updates

## 0.3.0

- 3 new widgets
	- multifader
	- multitoggle
	- multipush


## 0.2.1

- style update (push/toggle widgets, widgets' dragging handle)
- widget dragging/resizing doesn't get broken when editing the root
- sidepanel toggle doesn't select root for edition anymore

## 0.2.0

- editor code rewriting
	- right-click context-menu quick editing (widget copy/cut/paste, add & delete tabs/widgets)
