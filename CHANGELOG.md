# Changelog

## 0.4.6

- engine
  - electron 0.37.4
- features
  - `compact` option added to knob and fader

## 0.4.5

- engine
  - electron 0.37.3
- ui
  - new logo
  - better lobby design
- misc
  - renamed sliders/pads' `absolute` property to `snap`

## 0.4.4

- bug fixes
  - [headless] scripts are no longer bundled on the fly, it didn't work on some systems
  - touching widgets without changing their value doesn't make them send the same value again anymore
- ui
  - slightly tightened layout
- features
  - `noPip` option added to knob and fader
  - `preArgs` accepts object if the arg's type needs to be specified
  - knob supports breakpoints scale, same as fader's
  - fader and knob pip scales now support custom label
  - a push/toggle's value can be set to `null` if only the path needs to be sent in the osc messages
  -  push buttons do not update their own leds and return their value (for state save and widgets sync) based on their last changed property (led state or touch on/off)
- misc
  - refining the fader's pip scale that looked choppy on mobile devices. All pips are now evenly spaced, not relatively to the fader's height.
  - [desktop mode] saved sessions are added to history

## 0.4.3

- features
  - text widget can be `vertical`
  - panel widget `scroll` option
- bug fixes
  - smart pasting now works when the clipboard contains several widgets whose unsuffixed ids are the identical
  - osc received array that contain only one item are correctly unpacked (fixes cross-app sync for widgets that don't accept array, broken since the introduction of `preArgs`)
  - memory leak when loading a new session (cached tabs were not properly purged)
- misc
  - push widget doesn't fire its 'on' value if pressed while stuck in 'on' position
  - panel widgets don't have inner margins anymore
  - fader widget optimization : the pip scale is generated from a single gradient plus some elements for each breakpoint (instead of one element per percent), thus reducing the number of elements to draw.

## 0.4.2

- features
  - new widget : text (just displays received values)
- bug fixes
  - widget linking doesn't cause multiple unwanted osc sends anymore

## 0.4.1

- features
  - `preArgs` option for widgets (prepends constants to osc messages args)

## 0.4.0

- engine
  - electron 0.37.2 (chrome 49)
- ui
  - new flat ui
  - tab system rewritten : inactive tabs are detached from the DOM tree, thus improving performances while slowing down tab switching.
  - widget categories in editor's context menu
- features
  - logarithmic scaling (log10) support added to knob, fader & xy
  - mousewheel support added to knob and fader (ctrlKey for fine control)
  - new widgets : plot, visualizer & meter. Fader built-in feedback meter option
  - traversing gestures switch in sidepanel
  - custom color property for all widgets with inheritance (containers)
  - editor pasting function now smartly increments widget's id and path while keeping label if different from default
  - true theming support
- misc
  - sync/link event handling improved
  - stylesheets cannot be recompiled on the fly anymore (`--c` switch removed)
  - **new state save file format, no backward compatibility**

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
