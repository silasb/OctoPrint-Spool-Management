# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started.

import octoprint.plugin
import ipdb # debugging
import octoprint.server

class SpoolManagementPlugin(octoprint.plugin.StartupPlugin, octoprint.plugin.TemplatePlugin, octoprint.plugin.AssetPlugin, octoprint.plugin.EventHandlerPlugin, octoprint.plugin.ProgressPlugin, octoprint.plugin.SettingsPlugin):
	def on_after_startup(self):
		self._logger.info('init')
		self.printer = octoprint.server.printer
		self.progress = 0

	#def on_settings_save(self, data):


	def get_assets(self):
		return {
				'js': ['js/spool_management.js']
		}

	def get_template_configs(self):
		return [
				{
					'type': 'generic',
					'template': 'selector.jinja2'
				}
		]

	def save(self, data):
		super(SpoolManagementPlugin, self).on_settings_save(data)

	# def on_settings_load(self):
	# 	return dict(
	# 		spools=[dict(id="1234", name="name", amount_left="5000")]
	# 	)

	def on_settings_save(self, data):
		method = data['method']
		data.pop('method', None) # does this return the popped value?

		if method == 'patch':
			spool = data['spools'][0] # TODO: make it so I can patch multiple
			current = self._settings.get([], asdict=True, merged=True)
			self._logger.info('current settings %s', current)

			import octoprint.util

			spools = current['spools']
			spools.append(spool)

			_data = octoprint.util.dict_merge(current, dict(spools=spools))
			self._settings.set([], _data)

			self._logger.info('Saving settings %s', _data)

			# current['spools'].append(spool)
			# self._settings.set([], current)
		# if data['method']:

		# super(SpoolManagementPlugin, self).on_settings_save(data)

		# self._logger.info('Saving settings %s', data)

	def settings(self):
		return self._settings.get([], asdict=True, merged=True)

	def on_print_progress(self, storage, path, progress):
		self.progress = progress

	def on_event(self, event, payload):
		log = self._logger.info

		if event == 'PrintStarted':
			job = self.printer.getCurrentJob()
			length = job['filament']['tool0']['length']

			# check if we have enough filament, if not lets stop printing and show an error message.

			log('Settings %s' % self.settings())

			#settings = self.settings()
			#settings.spools = 

			self.save(dict(spools=[dict(name="bobby", color="blue")]))

			log('Started printing: %f' % length)

		if event == 'PrintDone':
			# commit to the database
			job = self.printer.getCurrentJob()
			length = job['filament']['tool0']['length']

		# handle these two cases
		#PrintFailed
		#PrintCancelled
		if event == 'PrintFailed' or event == 'PrintCancelled':
			# calculate print progress based on total filament extruded so far
			job = self.printer.getCurrentJob()
			length = job['filament']['tool0']['length']
			#adjusted_length = length * self.progress / 100

			#log('failed or cancelled: %f of %i%' % (adjusted_length, self.progress))

		#log(event)
		#log(payload)

# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "Spool Management"
__plugin_implementations__ = [SpoolManagementPlugin()]
