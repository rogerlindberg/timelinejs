Project TimelineJs
==================

This is an attempt to port the
[Timeline project](https://sourceforge.net/projects/thetimelineproj/) from
Python to Javascript.

This project uses the same file format for timeline- and configuration files
as the [Timeline project](https://sourceforge.net/projects/thetimelineproj/).
This means that the timeline files saved with Timeline can be read and updated
with TimelineJs.

Installation
============

Prerequisits
------------
To be able to run this application you need

- A HTML5 enabled browser
- A download of the project
- A Python 3.x installation

Download project
----------------
Go to a directory where you want to store this project and download it from
Bitbucket with the command

    git clone https://rogerlindberg@bitbucket.org/rogerlindberg/timelinejs.git

This command creates the following directory structure...

- timelinejs
    - source
        - main
            - cfg
            - css
            - js
            - startserver.cmd
            - startserver.py
            - timeline.html
        - test
        - tools

The web server
--------------
This project uses a web server to access the timeline- and configuration files.

In order to run the application on a local machine you can choose to use the
web server included in the project. To run the web server you need a Python
installation on your host.

The web server is started with the command

      python startserver.py

The startserver.py script is found in 'project-root'/source/main

The timeline files you creates are stored in the root directory of the
web server. When you start the web server in the directory
'project-root'/source/main, the timeline files will be stored in
this same directory.

Start application
=================
Give your web browser the URL http://localhost:8000/timeline.html

Take Backups
============
Since this is an experimental project we highly recommend that you take
backups of your timeline files before using this application.
