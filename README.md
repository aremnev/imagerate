imagerate
=========

Project for the photo contests. For staging server is used AppFog. http://contest-app.aws.af.cm/


How to build (Debian like OS):
------

0. Pick some directory to checkout node to:

    <pre>
    cd ~/projects
    </pre>


1. Check out project, and change directories:
    
    <pre>
    git clone https://github.com/aremnev/imagerate.git
    cd imagerate
    </pre>
    
2. Prepare node virtual environment with node-0.8.14 and installed modules with activation (recommended):

    <pre>
    make
    source env/node/bin/activate
    </pre>

3. Also if you don't want to use virtual node, you can skip previous step and install modules with your global node ():

    <pre>
    make clean install
    </pre>
    
4. Now you can test and run application:

    <pre>
    make test start
    </pre>
    
5. Install AppFog gem and upload files to [AppFog](http://appfog.com):

    <pre>
    make af-install af-update
    </pre>
    
List of Makefile commands:
------

* `clean` - remove node_modules and virtual environment folder.
* `node-virtual` - prepare node virtual environment ([nodeenv](https://github.com/ekalinin/nodeenv)) with node-0.8.14
* `install` - install mongodb and execute `npm install`
* `test` - execute test
* `test-coverage` - execute tests and generate coverage report file: `imagerate/covarage.html` ([JScovarage](http://siliconforks.com/jscoverage/))
* `af-install` - install af (AppFog) gem.
* `af-update` - prepare shrinkwrap and upload files to AppFog
* `all` - `make all` is the same as `make` without a command, execute `make clean node-virtual install`


