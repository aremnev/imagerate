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
    
2. Prepare node virtual environment and activate it:

    <pre>
    make node-virtaul
    source env/node/bin/activate
    </pre>
    
3. Now you can install, test and run application:

    <pre>
    make all
    </pre>
    
4. Install AppFog gem and upload files to [AppFog](http://appfog.com):

    <pre>
    make af-install af-update
    </pre>
    
List of Makefile commands:
------

* `clean` - remove node_modules and virtual environment folders.
* `node-virtual` - prepare node virtual environment ([nodeenv](https://github.com/ekalinin/nodeenv)) with node-0.10.5
* `install` - install mongodb and execute `npm install`
* `test` - execute test
* `test-coverage` - execute tests and generate coverage report file: `imagerate/covarage.html` ([JScovarage](http://siliconforks.com/jscoverage/))
* `af-install` - install af (AppFog) gem.
* `af-update` - prepare shrinkwrap and upload files to AppFog


