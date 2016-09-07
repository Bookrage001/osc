# Changelog

## 0.6.2

- cool stuff
  - armv7l prebuilt binaries ! (raspberry 2, etc)
- engine
  - electron 1.3.5

## 0.6.1

- bug fixes
  - editor: widgets/tabs can be accessed through their parent's children list (#27)
- engine
  - electron 1.3.1

## 0.6.0

- bug fixes
  - pasted widget properly use the pointer's position
  - traversing gestures are effective from the first touch, not after the first move
  - out-of-range values are properly clipped by faders/knob
- ui
  - Faders & Meters design improved
  - The main font (droid sans) is now loaded...
  - Knob's sizing got smarter
  - Widgets don't blink not jump when they appear for the first time or when they resize
- misc
  - Fader's `align` option replaced with boolean option `alignRight`
  - Widget's `label` now accepts special directive `icon: fontawesome-class` to display icons from [FontAwesome](http://fontawesome.io/icons/)
  - Text widget `defaultText` option added
- engine
  - electron 1.2.2

## 0.5.4

- bug fixes
  - [desktop] menu bar auto-hide
  - [headless] multitouch support
- ui
  - [mobile] better faders pips rendering
  - fixed horizontal fader knob centering
  - [mobile] better numeric inputs rendering (not blurred anymore)
- engine
  - [desktop] electron 1.2.0 (chrome 51)

## 0.5.3

- bug fixes
  - [again] touch fake-right-click only fires on long touch, not after every tap
  - traversing gestures bug with touch
- misc
  - better mouse/touch drag events handlers
- engine
  - electron 1.1.1

## 0.5.2

- bug fixes
  - touch fake-right-click only fires on long touch, not after every tap

## 0.5.1

- bug fixes
  - feedback is now handled precisely by widets (ie not rounded according to the `precision` option, see issue #21)
- engine
  - electron 1.1.0

## 0.5.0

- bug fixes
  - touch/mouse events are both handled simultaneously, module rewritten for better performances (see issue #18)
- engine
  - electron 1.0.2


## 0.4.8

- bug fixes
  - regression preventing newly created widgets from using the pointer's coordinates as position
  - add 0.4.7's fix to headless mode

## 0.4.7

- bug fixes
  - regression causing widgets with `preArgs` to not receive osc correctly

## 0.4.6

- engine
  - electron 0.37.6
  - node-osc 2.0.3
- features
  - `compact` option added to knob and fader
  - if an osc input port is specified, osc messages will be sent from it. This enhances compatibility with apps that send their feedback messages directly to the sender.
- misc
  - mouse/touch dragging handler rewritten, now using event delegation and direct handler calls instead of DOM event bubbling whenever it's possible

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
