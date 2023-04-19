# vcard-cryptoperson

## What

A parser that creates a limited iOS / Android / Google Contacts compatible vCard v3, as well as an Outlook compatible .csv.

It also includes and extended schema for a [Schema.org Person](https://schema.org/Person) to include properties for describing cryptocurrency public keys & addresses.

## Why

There is no official support for the "KEY" property in vCard v3, and no wide support for vCard v4.

In addition, there is no support in Schema.org for a cryptocurrency key or address.

## Notes

Current datastructure is taken from a new standard on SpaceDatatStandards.org, the [UPM](https://spacedatastandards.org/#/Standard/SDS-7-User-Profile-Message-(UPM))