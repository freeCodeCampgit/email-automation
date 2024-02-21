# Email Automation

This handles spinning up the droplets, managing the files, and tearing down the droplets with simple command line scripts. The idea is to make it less error-prone and tedious to prepare an email blast.

Pairs with our [email blast utility](https://github.com/freecodecamp/ses-email-blast).

## Requirements

- You will need to have the [DigitalOcean CLI](https://docs.digitalocean.com/reference/doctl/) installed.
- You will need to auth the `doctl` CLI, setting the `--context` to `fcc` (the commands rely on this auth context name.)
- You will need to configure the environment variables. Copy `sample.env` to `.env` and fill in the values.
- You will need an SSH key available in your DigitalOcean account.

## Usage

You'll need to start by configuring the environment variables for the email blast servers themselves. Copy the `emails.env` and `mongo.env` from the `templates` directory to the `data` directory and fill in the values. Add an `emailBody.txt` file to the `data` directory and fill in the email body.

### Getting the Email List

#### Spin up the DB droplet

To run the database query, you'll first need a droplet to do so. Typically you want to run the DB query the day before the blast, to avoid delaying your send. Run `pnpm run db:setup` to spin up the droplet.

#### Prepare the DB droplet

Running `pnpm run db:init` will load the necessary files to the query droplet, and give you instructions for running the query.

#### Teardown the DB droplet

Once the database query is complete, run `pnpm run db:teardown` to download the email list and automatically destroy the droplet to save costs.

### Running the Blast

#### Spin up the droplets

Run `pnpm run setup` to spin up new droplets. The script will automatically grant access to the configured ssh key, and assign the droplets to the configured project.

#### Initialise the files

Run `pnpm run init` to initialise the files on the droplets. This will copy the `emails.env` and `emailBody.txt` files to the droplets. It will also copy the `mongo.env` specifically to the first droplet, which is where you'll need to go run the database query.

#### Generate the email list

Once the query is complete, run `pnpm run emails`. This will pull down the full email list from the query, and batch it into files of equivalent size (or as close as it can), one for each droplet. It will push the email lists up to each droplet. Then you can ssh into each droplet and start the sending process.

#### Clean up

Run `pnpm run clean` to clean up your local email lists. This is very important for security.

#### Teardown the droplets

Once the email blasts are all complete, run `pnpm run teardown` to automatically delete the droplets.
