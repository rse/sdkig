
SDKIG
=====

**Stream-Deck Key-Image Generator**

<p/>
<img src="https://nodei.co/npm/sdkig.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/sdkig.png" alt=""/>

Abstract
--------

SDKIG is a small utility for generating key images for [Elgato Stream
Deck](https://www.elgato.com/en/gaming/stream-deck) devices. The key images are generated with a size of 288x288 pixels (similar
to the official online [Key Creator](https://www.elgato.com/en/gaming/keycreator), although
the device seems to downscale them to just 72x72 pixels) and are rendered
with the combination of a prominent centered [FontAwesome](https://fontawesome.com/)
[icon](https://fontawesome.com/icons?d=gallery&m=free)
and a small [TypoPRO](http://typopro.org/)
[Source Sans Pro](http://typopro.org/specimen/specimen.html#TypoPRO_0_Source_0_Sans_0_Pro-normal-normal-normal-normal)
based title at the bottom. The colors of the background, the icon and the title can be
choosen through arbitrary RGB values.

Installation
------------

```sh
$ npm install -g sdkig
```

Requirements
------------

Unfortunately, this utility needs a licensed [PrinceXML](https://www.princexml.com/) **prince**(1)
and the free [Poppler](https://poppler.freedesktop.org/) **pdftocairo**(1) utilities in the shell PATH.
PrinceXML is needed for rendering the internally generated HTML to the intermediate PDF format.
Poppler is needed for rendering the intermediate PDF to the PNG output format.

Usage
-----

```sh
Usage: sdkig [-h|--help] [-V|--version] [-b|--background-color <rgb-color>]
[-i|--icon-name <name>] [-I|--icon-color <rgb-color>] [-s|--subicon-name <name>]
[-S|--subicon-color <rgb-color>] [-t|--title-text <text>] [-T|--title-color
<rgb-color>] [-f|--title-font <typopro-font-id>] [-o|--output-file <png-file>]

Options:
  -h, --help              Show help                   [boolean] [default: false]
  -V, --version           show program version information
                                                      [boolean] [default: false]
  -b, --background-color  background color         [string] [default: "#000000"]
  -i, --icon-name         icon name                       [string] [default: ""]
  -I, --icon-color        icon color               [string] [default: "#ffffff"]
  -s, --subicon-name      subicon name                    [string] [default: ""]
  -S, --subicon-color     subicon color            [string] [default: "#ffffff"]
  -t, --title-text        title text                      [string] [default: ""]
  -T, --title-color       title color              [string] [default: "#e0e0e0"]
  -o, --output-file       output file                     [string] [default: ""]
```

Example
-------

```sh
$ sdkig -b bb0000 -i radiation-alt -I ffc0c0 -t "ATTENTION" -T ffffff -o sample1.png
$ sdkig -b 336699 -s graduation-cap -S 6699cc -i face-grin -I d0e0ff -t "USERS" -T ffffff -o sample2.png
```

![sample1](sample1.png)
![sample2](sample2.png)

License
-------

Copyright &copy; 2020-2022 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

