# How to build the docs

```bash
$ sudo apt-get install python python-pip
$ sudo pip install mkdocs
$ sudo pip install mkdocs-cinder

$ mkdocs serve # make docs available on http://127.0.0.1:8000
$ mkdocs build # build docs static sensitive
$ mkdocs gh-deploy --clean # deploy static site on gh-pages branch
```
