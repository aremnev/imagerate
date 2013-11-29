#!/bin/bash

STAGING='contest-app'
PRODUCTION='imagerate'

update(){
  af logout && \
  if [[ `af user | grep -F "[N/A]"` > /dev/null ]]; then af login; fi && \
  	af update $1
}

PS3='Please select environment: '
options=("Staging" "Production")
select opt in "${options[@]}"
do
    case $opt in
        "Staging")
            update $STAGING
            break
            ;;
        "Production")
            update $PRODUCTION
            break
            ;;
        *) echo invalid option;;
    esac
done
