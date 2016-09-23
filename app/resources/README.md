# How to build the docs

```bash
$ sudo apt-get install python python-pip  # python package manager
$ sudo pip install mkdocs                 # docs site builder
$ sudo pip install mkdocs-cinder          # theme

$ mkdocs serve              # make docs available on http://127.0.0.1:8000
$ mkdocs build              # build docs static site
$ mkdocs gh-deploy --clean  # deploy static site on gh-pages branch
```
