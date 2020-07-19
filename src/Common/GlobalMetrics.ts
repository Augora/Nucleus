import Metric from './Metric'

class GlobalMetrics {
  deputes: Metric = new Metric()

  addCreatedDepute() {
    this.deputes.created = this.deputes.created + 1
  }

  addReadDepute() {
    this.deputes.read = this.deputes.read + 1
  }

  addUpdatedDepute() {
    this.deputes.updated = this.deputes.updated + 1
  }

  addNoneDepute() {
    this.deputes.none = this.deputes.none + 1
  }

  addErroredDepute() {
    this.deputes.error = this.deputes.error + 1
  }
}

export default new GlobalMetrics()
