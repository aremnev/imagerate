#!/bin/bash
#deploy to heroku
STAGING=herokuStaging
PRODUCTION=production
ENV=staging
CONFIG=scripts/heroku.conf
USING_CONFIG=

read_config(){
  echo "Enter mongolab username and password"
  read MONGOLAB_USERNAME MONGOLAB_PASS
  MONGOLAB=mongodb://${MONGOLAB_USERNAME}:${MONGOLAB_PASS}@ds047948.mongolab.com:47948/imagerate

  echo "Please paste cloudinary url"
  read CLOUDINARY_URL
}

echo "Try to log in to heroku"
heroku login

echo "Add new remote to git for heroku"
#add new remote for heroku
heroku git:remote -a thumbtack-imagerate

PS3='Please select environment: '
options=("Staging" "Production")
select opt in "${options[@]}"
do
    case $opt in
        "Staging")
            ENV=${STAGING}
            break
            ;;
        "Production")
            ENV=${PRODUCTION}
            break
            ;;
        *) echo "invalid option"
            ;;
    esac
done
if [ -e ${CONFIG} ]
  then
    echo "Do you want to use saved params? [y/n]"
    read saved
    if [ ${saved} == "y" ]
      then
        echo "using saves config"
        USING_CONFIG=1
        source ${CONFIG}
      else
        read_config
    fi
  else
    read_config
fi

echo "Set environment variables for $ENV"
#set environment variables
heroku config:set NODE_ENV=${ENV}
heroku config:set MONGOLAB_URL=${MONGOLAB}
heroku config:set CLOUDINARY_URL=${CLOUDINARY_URL}

echo "Push"
git push heroku master

if [ -z ${USING_CONFIG} ]
  then
  echo "Do you want to save this params to file? [y/n]"
  read answer
  if [ ${answer} == "y" ]
    then echo -e "MONGOLAB=${MONGOLAB}\nCLOUDINARY_URL=${CLOUDINARY_URL}" > ${CONFIG}
  fi
fi