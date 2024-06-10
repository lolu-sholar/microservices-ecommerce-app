#!/bin/bash
curl -f http://user:9000/profile/life-is-good | grep "Life is good!" && exit 0 || exit 1